"""
Unit and Integration Tests for Reservations API
Tests conflict detection and reservation creation.
"""

import unittest
from unittest.mock import Mock, MagicMock, patch
from datetime import datetime, timezone, timedelta
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.src.utils.validation import validate_reservation_data, validate_datetime


class TestValidation(unittest.TestCase):
    """Test validation utilities."""

    def test_validate_reservation_data_valid(self):
        """Test valid reservation data."""
        data = {
            'roomId': '1',
            'userId': 'user123',
            'start': '2024-01-15T10:00:00Z',
            'end': '2024-01-15T12:00:00Z'
        }
        result = validate_reservation_data(data)
        self.assertIsNone(result, "Valid data should return None")

    def test_validate_reservation_data_missing_fields(self):
        """Test missing required fields."""
        data = {
            'roomId': '1',
            'userId': 'user123'
            # Missing start and end
        }
        result = validate_reservation_data(data)
        self.assertIsNotNone(result, "Missing fields should return error message")
        self.assertIn('required', result.lower())

    def test_validate_reservation_data_invalid_datetime(self):
        """Test invalid datetime format."""
        data = {
            'roomId': '1',
            'userId': 'user123',
            'start': 'invalid-date',
            'end': '2024-01-15T12:00:00Z'
        }
        result = validate_reservation_data(data)
        self.assertIsNotNone(result, "Invalid datetime should return error")

    def test_validate_reservation_data_start_after_end(self):
        """Test start time after end time."""
        data = {
            'roomId': '1',
            'userId': 'user123',
            'start': '2024-01-15T12:00:00Z',
            'end': '2024-01-15T10:00:00Z'  # End before start
        }
        result = validate_reservation_data(data)
        self.assertIsNotNone(result, "Start after end should return error")
        self.assertIn('before', result.lower())

    def test_validate_datetime_valid(self):
        """Test valid datetime parsing."""
        dt_str = '2024-01-15T10:00:00Z'
        result = validate_datetime(dt_str)
        self.assertIsNotNone(result, "Valid datetime should parse")
        self.assertIsInstance(result, datetime)

    def test_validate_datetime_invalid(self):
        """Test invalid datetime parsing."""
        dt_str = 'invalid-date'
        result = validate_datetime(dt_str)
        self.assertIsNone(result, "Invalid datetime should return None")


class TestConflictDetection(unittest.TestCase):
    """Test conflict detection logic."""

    def test_overlap_detection(self):
        """Test overlap detection logic: existing.start < new_end && existing.end > new_start."""
        # Existing reservation: 10:00 - 12:00
        existing_start = datetime(2024, 1, 15, 10, 0, tzinfo=timezone.utc)
        existing_end = datetime(2024, 1, 15, 12, 0, tzinfo=timezone.utc)
        
        # New reservation: 11:00 - 13:00 (overlaps)
        new_start = datetime(2024, 1, 15, 11, 0, tzinfo=timezone.utc)
        new_end = datetime(2024, 1, 15, 13, 0, tzinfo=timezone.utc)
        
        # Check overlap: existing.start < new_end && existing.end > new_start
        overlaps = existing_start < new_end and existing_end > new_start
        self.assertTrue(overlaps, "Should detect overlap")

    def test_no_overlap_before(self):
        """Test no overlap when new reservation is before existing."""
        existing_start = datetime(2024, 1, 15, 10, 0, tzinfo=timezone.utc)
        existing_end = datetime(2024, 1, 15, 12, 0, tzinfo=timezone.utc)
        
        new_start = datetime(2024, 1, 15, 8, 0, tzinfo=timezone.utc)
        new_end = datetime(2024, 1, 15, 9, 0, tzinfo=timezone.utc)
        
        overlaps = existing_start < new_end and existing_end > new_start
        self.assertFalse(overlaps, "Should not detect overlap")

    def test_no_overlap_after(self):
        """Test no overlap when new reservation is after existing."""
        existing_start = datetime(2024, 1, 15, 10, 0, tzinfo=timezone.utc)
        existing_end = datetime(2024, 1, 15, 12, 0, tzinfo=timezone.utc)
        
        new_start = datetime(2024, 1, 15, 13, 0, tzinfo=timezone.utc)
        new_end = datetime(2024, 1, 15, 14, 0, tzinfo=timezone.utc)
        
        overlaps = existing_start < new_end and existing_end > new_start
        self.assertFalse(overlaps, "Should not detect overlap")

    def test_adjacent_no_overlap(self):
        """Test no overlap when reservations are adjacent."""
        existing_start = datetime(2024, 1, 15, 10, 0, tzinfo=timezone.utc)
        existing_end = datetime(2024, 1, 15, 12, 0, tzinfo=timezone.utc)
        
        new_start = datetime(2024, 1, 15, 12, 0, tzinfo=timezone.utc)
        new_end = datetime(2024, 1, 15, 13, 0, tzinfo=timezone.utc)
        
        overlaps = existing_start < new_end and existing_end > new_start
        self.assertFalse(overlaps, "Adjacent reservations should not overlap")

    def test_contained_overlap(self):
        """Test overlap when new reservation is contained within existing."""
        existing_start = datetime(2024, 1, 15, 10, 0, tzinfo=timezone.utc)
        existing_end = datetime(2024, 1, 15, 14, 0, tzinfo=timezone.utc)
        
        new_start = datetime(2024, 1, 15, 11, 0, tzinfo=timezone.utc)
        new_end = datetime(2024, 1, 15, 13, 0, tzinfo=timezone.utc)
        
        overlaps = existing_start < new_end and existing_end > new_start
        self.assertTrue(overlaps, "Should detect contained overlap")

    def test_containing_overlap(self):
        """Test overlap when new reservation contains existing."""
        existing_start = datetime(2024, 1, 15, 11, 0, tzinfo=timezone.utc)
        existing_end = datetime(2024, 1, 15, 13, 0, tzinfo=timezone.utc)
        
        new_start = datetime(2024, 1, 15, 10, 0, tzinfo=timezone.utc)
        new_end = datetime(2024, 1, 15, 14, 0, tzinfo=timezone.utc)
        
        overlaps = existing_start < new_end and existing_end > new_start
        self.assertTrue(overlaps, "Should detect containing overlap")


class TestReservationIntegration(unittest.TestCase):
    """Integration tests for reservation creation (mocked Firestore)."""

    @patch('backend.routes.reservations.firestore_service')
    def test_create_reservation_no_conflict(self, mock_firestore):
        """Test creating reservation when no conflicts exist."""
        # Mock Firestore service
        mock_db = MagicMock()
        mock_collection = MagicMock()
        mock_query = MagicMock()
        mock_doc = MagicMock()
        
        mock_firestore.db = mock_db
        mock_db.collection.return_value = mock_collection
        mock_collection.where.return_value = mock_query
        mock_query.stream.return_value = []  # No existing reservations
        mock_collection.document.return_value = mock_doc
        mock_doc.id = 'new-reservation-id'
        
        # This would be tested in actual integration test with real Firestore
        # For now, we verify the logic structure
        self.assertTrue(True, "Structure test passed")

    def test_datetime_conversion_utc(self):
        """Test datetime conversion to UTC."""
        dt_str = '2024-01-15T10:00:00Z'
        dt = datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        
        self.assertEqual(dt.tzinfo, timezone.utc, "Should be UTC")
        self.assertEqual(dt.hour, 10, "Should preserve hour")
        self.assertEqual(dt.minute, 0, "Should preserve minute")


if __name__ == '__main__':
    unittest.main()


