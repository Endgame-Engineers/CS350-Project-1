// Carlos
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import axios from 'axios';
import { getActivityLogs, addActivityLog, deleteActivityLog, getActivities } from '../../src/services/ActivityLogs';
import { logger } from '../../src/services/Logger';
import { ActivityLog, Activity } from '../../src/models/Models';

vi.mock('axios');
vi.mock('../../src/services/Logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ActivityLogs.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getActivityLogs', () => {
    it('should retrieve and give activity logs by date', async () => {
      const mockData: ActivityLog[] = [
        { id: 1, userid: 1, dateadded: new Date('2023-12-03'), activityid: 1, durationminutes: 30 },
        { id: 2, userid: 1, dateadded: new Date('2023-12-05'), activityid: 2, durationminutes: 45 },
        { id: 3, userid: 1, dateadded: new Date('2023-12-01'), activityid: 3, durationminutes: 15 },
      ];

      (axios.get as Mock).mockResolvedValueOnce({ data: mockData });

      const start = new Date('2023-12-01');
      const end = new Date('2023-12-31');
      const logs = await getActivityLogs(start, end);

      expect(axios.get).toHaveBeenCalledWith('/api/user/activity', {
        params: { start, end },
      });
      expect(logs).toEqual([
        mockData[0], // 2023-12-05
        mockData[1], // 2023-12-03
        mockData[2], // 2023-12-01
      ]);
      expect(logger.info).toHaveBeenCalledWith('Meal logs retrieved');
    });

    it('should reject with an error if invalid dates are provided', async () => {
      const invalidDate = 'invalid-date';

      await expect(getActivityLogs(new Date(invalidDate), new Date())).rejects.toThrow(
        'Invalid date objects'
      );

      expect(logger.error).toHaveBeenCalledWith('Invalid date objects');
    });

    it('should handle API errors gracefully', async () => {
      (axios.get as Mock).mockRejectedValueOnce(new Error('API Error'));

      const start = new Date('2023-12-01');
      const end = new Date('2023-12-31');

      await expect(getActivityLogs(start, end)).rejects.toThrow('Could not get meal logs.');
      expect(logger.error).toHaveBeenCalledWith('Error getting meal logs', expect.any(Error));
    });
  });

  describe('addActivityLog', () => {
    it('should add a new activity log', async () => {
      const mockActivityLog: ActivityLog = {
        id: 1,
        userid: 1,
        dateadded: new Date('2023-12-05'),
        activityid: 2,
        durationminutes: 45,
      };

      (axios.post as Mock).mockResolvedValueOnce({ data: mockActivityLog });

      const result = await addActivityLog(mockActivityLog);

      expect(axios.post).toHaveBeenCalledWith('/api/user/activity', mockActivityLog);
      expect(result).toEqual(mockActivityLog);
      expect(logger.info).toHaveBeenCalledWith('Activity log added');
    });

    it('should handle API errors gracefully when adding an activity log', async () => {
      (axios.post as Mock).mockRejectedValueOnce(new Error('API Error'));

      const mockActivityLog: ActivityLog = {
        id: 1,
        userid: 1,
        dateadded: new Date('2023-12-05'),
        activityid: 2,
        durationminutes: 45,
      };

      await expect(addActivityLog(mockActivityLog)).rejects.toThrow('Could not add activity log.');
      expect(logger.error).toHaveBeenCalledWith('Error adding activity log', expect.any(Error));
    });
  });

  describe('deleteActivityLog', () => {
    it('should delete an activity log by ID', async () => {
      const id = 1;

      (axios.delete as Mock).mockResolvedValueOnce({});

      await deleteActivityLog(id);

      expect(axios.delete).toHaveBeenCalledWith(`/api/user/activity/${id}`);
      expect(logger.info).toHaveBeenCalledWith('Activity log deleted');
    });

    it('should handle API errors gracefully when deleting an activity log', async () => {
      (axios.delete as Mock).mockRejectedValueOnce(new Error('API Error'));

      const id = 1;

      await expect(deleteActivityLog(id)).rejects.toThrow('Could not delete activity log.');
      expect(logger.error).toHaveBeenCalledWith('Error deleting activity log', expect.any(Error));
    });
  });

  describe('getActivities', () => {
    it('should retrieve a list of activities', async () => {
      const mockActivities: Activity[] = [
        { id: 1, activity: 'Running', MET: 8, description: 'Running at 6 mph' },
        { id: 2, activity: 'Cycling', MET: 6, description: 'Cycling at 10 mph' },
      ];

      (axios.get as Mock).mockResolvedValueOnce({ data: mockActivities });

      const activities = await getActivities();

      expect(axios.get).toHaveBeenCalledWith('/api/user/activities');
      expect(activities).toEqual(mockActivities);
      expect(logger.info).toHaveBeenCalledWith('Activities retrieved');
    });

    it('should handle API errors gracefully when retrieving activities', async () => {
      (axios.get as Mock).mockRejectedValueOnce(new Error('API Error'));

      await expect(getActivities()).rejects.toThrow('Could not get activities.');
      expect(logger.error).toHaveBeenCalledWith('Error getting activities', expect.any(Error));
    });
  });
});
