import React, { useEffect, useState } from 'react';
import { Card, Button, message, Empty, Spin, Row, Col, Input, Modal } from 'antd';
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';

const File = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            try {
                const username = localStorage.getItem('username');
                const response = await fetch(`http://localhost:5000/api/user/files/${username}`);
                const data = await response.json();
                setFiles(data.files || []); 
            } catch (error) {
                console.error('Failed to fetch files:', error);
                message.error('Failed to load files.');
            }
            setLoading(false);
        };

        fetchFiles();
    }, []);





    // download the file 

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [code, setCode] = useState('');
    const [isCodeCorrect, setIsCodeCorrect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [delfile, setDelfile] = useState('');

    const handleCodeChange = (e) => {
        setCode(e.target.value);
    };

   
    const validateCode = async () => {
        if (delfile.uniqueCode === code) {
            handleDownload(delfile);
            setIsModalVisible(false);
            setErrorMessage('');
        } else {
            setErrorMessage('Incorrect code. Please try again.');
        }
    };

    

    const handleDownload = (file) => {
        window.location.href = `http://localhost:5000/api/download/${delfile.fileName}`;

        console.log('code validate succefully')
    };

    const showModal = (file) => {
        setDelfile(file)
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        validateCode();
    };


    const handleDelete = async (file) => {
        const username = localStorage.getItem('username')
        const filename = file.fileName

        try {
            const response = await fetch(`http://localhost:5000/api/delete/${file.uniqueCode}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, filename }), 
            });

            if (response) {
                // Remove the deleted file from UI
                setFiles((prevFiles) => prevFiles.filter(f => f.uniqueCode !== file.uniqueCode));
                message.success('File deleted successfully!');

            } else {
                const errorData = await response.json();
                message.error(`Failed to delete file: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            message.error('An error occurred while deleting the file.');
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            {loading ? (
                <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} />
            ) : files.length === 0 ? (
                <Empty description="No files uploaded" style={{ padding: '50px', textAlign: 'center' }} />
            ) : (
                <Row gutter={[16, 16]} justify="center" className='mt-20'>
                    {files.map(file => (
                        <Col xs={24} sm={12} md={8} lg={6} key={file.uniqueCode}>
                            <Card
                                hoverable
                                title={file.fileName}
                                style={{ width: '100%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                                cover={
                                    <img
                                        alt={file.fileName}
                                        src={file.thumbnailUrl || 'https://via.placeholder.com/300'} 

                                        style={{ height: 200, objectFit: 'cover' }}
                                    />
                                }
                                actions={[
                                    <DownloadOutlined key="download" onClick={() => showModal(file)} />,
                                    <DeleteOutlined key="delete" onClick={() => handleDelete(file)} />,
                                ]}
                            >
                                <Card.Meta description={`File name: ${file.fileName}`} />
                                <Card.Meta description={`Unique Code: ${file.uniqueCode}`} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
            <Modal
                title="Enter Code to Download"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={code}
                        onChange={handleCodeChange}
                        maxLength={6}
                        required
                    />
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginTop: '10px' }}
                    >
                        Submit
                    </Button>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </form>
            </Modal>
        </div>

    );
};

export default File;
