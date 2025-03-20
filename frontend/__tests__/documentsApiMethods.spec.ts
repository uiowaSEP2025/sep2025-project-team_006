import { apiGETDocument, apiPOSTDocument } from '../api/documentsApiMethods';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('apiGETDocument', () => {
    it('should fetch the document and return an object URL', async () => {
        const fakeBlob = new Blob(['dummy content'], { type: 'application/pdf' });
        const fakeUrl = 'blob:http://localhost/fake-url';
        const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = jest.fn().mockReturnValue(fakeUrl);

        mockedAxios.get.mockResolvedValueOnce({ data: fakeBlob });

        const webService = 'http://localhost:5000/api/documents/:id';
        const documentId = '123';

        const result = await apiGETDocument(webService, documentId);

        expect(mockedAxios.get).toHaveBeenCalledWith(
            'http://localhost:5000/api/documents/123',
            {
                responseType: 'blob',
                withCredentials: true,
            }
        );
        expect(URL.createObjectURL).toHaveBeenCalledWith(fakeBlob);
        expect(result).toBe(fakeUrl);

        URL.createObjectURL = originalCreateObjectURL;
    });
});

describe('apiPOSTDocument', () => {
    it.skip('should upload the document and return the response data', async () => {
        const fakeFile = new File(['dummy content'], 'test.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const fakeResponseData = {
            success: true,
            payload: {
                document_id: 1,
                document_type: 'xlsx',
                file_path: 'uploads/file-123456.xlsx',
                uploaded_at: '2025-03-15T19:03:55.598Z',
            },
        };

        mockedAxios.post.mockResolvedValueOnce({ data: fakeResponseData });

        const webService = 'http://localhost:5000/api/documents';
        const documentType = 'xlsx';
        const applicationId = 6;

        const result = await apiPOSTDocument(webService, fakeFile, documentType, applicationId);

        expect(mockedAxios.post).toHaveBeenCalled();
        const callArgs = mockedAxios.post.mock.calls[0];
        const urlCalled = callArgs[0];
        const formDataPassed = callArgs[1];
        const configPassed = callArgs[2];

        expect(urlCalled).toBe(webService);
        expect(configPassed?.headers?.['Content-Type']).toBe('multipart/form-data');
        expect(configPassed?.withCredentials).toBe(true);
        const entries: [string, any][] = [];
        // @ts-ignore - FormData.forEach is available in browsers, if not available, you can polyfill in tests.
        formDataPassed.forEach((value: any, key: string) => {
            entries.push([key, value]);
        });
        const expectedEntries: [string, any][] = [
            ['file', fakeFile],
            ['document_type', documentType],
            ['application_id', String(applicationId)],
        ];
        expectedEntries.forEach(([key, value]) => {
            expect(entries).toEqual(
                expect.arrayContaining([[key, value]])
            );
        });

        expect(result).toEqual(fakeResponseData);
    });
});
