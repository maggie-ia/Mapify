import { processText } from '../src/services/textProcessingService';
import { checkMembershipLimits } from '../src/utils/membershipUtils';
import axios from 'axios';

jest.mock('axios');
jest.mock('../src/utils/membershipUtils');

describe('Text Processing Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('processText should call API with correct parameters', async () => {
    const mockResponse = { data: { result: 'Processed text' } };
    axios.post.mockResolvedValue(mockResponse);
    checkMembershipLimits.mockResolvedValue(true);

    const result = await processText({ operation: 'summarize', text: 'Sample text' });

    expect(axios.post).toHaveBeenCalledWith('/api/process', {
      operation: 'summarize',
      text: 'Sample text'
    });
    expect(result).toEqual({ result: 'Processed text', operationType: 'summarize' });
  });

  test('processText should throw an error if membership limits are exceeded', async () => {
    checkMembershipLimits.mockRejectedValue(new Error('Membership limit exceeded'));

    await expect(processText({ operation: 'summarize', text: 'Sample text' }))
      .rejects.toThrow('Membership limit exceeded');

    expect(axios.post).not.toHaveBeenCalled();
  });

  // Add more tests for other functions and edge cases
});