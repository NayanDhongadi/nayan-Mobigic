import React from 'react';
import { Upload, message, Card, Button } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import 'tailwindcss/tailwind.css';

const { Dragger } = Upload;


const props = {
    name: 'file',
    multiple: true,
    action: 'http://localhost:5000/api/upload',
    onChange(info) {
        const { status } = info.file;
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    customRequest: async ({ file, onSuccess, onError }) => {
        const username = localStorage.getItem('username')



        if (!username) {
            message.error('Please login First');
            return onError(new Error('Login not found.'));
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', username);

        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.status === 200) {
                onSuccess(await response.json());
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            onError(error);
        }
    }
};

function Home() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Card
                className="shadow-lg rounded-lg w-2/3 p-8"
                title="Upload Files"
                bordered={false}
            >
                <Dragger {...props} className="rounded-lg bg-white p-6">
                    <p className="ant-upload-drag-icon" >
                        <InboxOutlined className="text-blue-500 text-4xl" />
                    </p>
                    <p className="ant-upload-text text-gray-600">
                        Drag and drop files here or click to upload
                    </p>
                    <p className="ant-upload-hint text-gray-500">
                        Supports single or bulk upload...
                    </p>
                </Dragger>
            </Card>
        </div>
    );
}

export default Home;
