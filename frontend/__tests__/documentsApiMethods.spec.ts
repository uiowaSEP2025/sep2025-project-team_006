import { apiGETDocument, apiPOSTDocument } from '@/api/documentsApiMethods';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('apiGETDocument', () => {
  const originalCreateObjectURL = URL.createObjectURL;

  beforeAll(() => {
    URL.createObjectURL = jest.fn().mockReturnValue('blob://fake-url');
  });

  afterAll(() => {
    URL.createObjectURL = originalCreateObjectURL;
  });

  it('formats URL, fetches blob, and returns object URL', async () => {
    const blob = new Blob(['data'], { type: 'application/pdf' });
    mockedAxios.get.mockResolvedValueOnce({ data: blob });

    const result = await apiGETDocument('https://api/doc/:id', '123');

    expect(mockedAxios.get).toHaveBeenCalledWith('https://api/doc/123', {
      responseType: 'blob',
      withCredentials: true,
    });
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(result).toBe('blob://fake-url');
  });

  it('logs and rethrows on error', async () => {
    const error = new Error('Network error');
    mockedAxios.get.mockRejectedValueOnce(error);
    await expect(apiGETDocument('https://api/doc/:id', '999')).rejects.toThrow('Network error');
  });
});

describe('apiPOSTDocument', () => {
  it('uploads file with formData and returns response data', async () => {
    const file = new File(['contents'], 'test.png', { type: 'image/png' });
    const responseData = { success: true };
    mockedAxios.post.mockResolvedValueOnce({ data: responseData });

    const result = await apiPOSTDocument('https://api/upload', file, 'pdf', 42);

    expect(mockedAxios.post).toHaveBeenCalled();
    const [url, formData, options] = mockedAxios.post.mock.calls[0];
    expect(url).toBe('https://api/upload');
    expect(options).toEqual({
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });

    // verify formData contents
    const entries = Array.from((formData as FormData).entries());
    expect(entries).toEqual(
      expect.arrayContaining([
        ['file', file],
        ['document_type', 'pdf'],
        ['application_id', '42'],
      ])
    );
    expect(result).toEqual(responseData);
  });

  it('logs and rethrows on upload error', async () => {
    const file = new File(['X'], 'x.txt', { type: 'text/plain' });
    const error = new Error('Upload failed');
    mockedAxios.post.mockRejectedValueOnce(error);

    await expect(apiPOSTDocument('https://api/upload', file, 'xlsx', 7)).rejects.toThrow('Upload failed');
  });
});
