import { Injectable } from '@nestjs/common';

/**
 * Job: Handles the logic for the controller
 */
@Injectable()
export class TestService {
    private testData = [{ id: 1, message: 'Hello, world!' }];

    getTestData() {
        return this.testData;
    }

    postTestData(data: { message: string }) {
        const newEntry = {
            id: this.testData.length + 1,
            message: data.message
        };
        this.testData.push(newEntry);
        return { success: true, newEntry };
    }

    putTestData(id: string, data: { message: string }) {
        const index = this.testData.findIndex((item) => item.id === Number(id));
        if (index === -1) {
            return { success: false, message: 'ID not found' };
        }
        this.testData[index].message = data.message;
        return { success: true, updatedEntry: this.testData[index] };
    }
}
