import React from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography } from 'antd';
import { Form, Input, Button } from 'antd';

const { Text } = Typography;

function Signup(props) {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const { username, password } = values;

    try {
      const response = await fetch(`http://localhost:5000/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 409) {
        message.error('Email or username already exists');
      } else if (response.status === 201) {
        message.success('Signup successful! Please proceed with login');
        props.onFlip()
        form.resetFields();
      } else {
        message.error('Something went wrong, please try again');
      }
    } catch (error) {
      console.error(error);
      message.error('Error occurred while signing up');
    }
  };

  return (
    <div className="signup">
      <div className="signup-form-container">
        <h1 className="text-4xl text-center font-bold text-blue-600 my-6">
          <span className="text-blue-800">Sign</span>Up
        </h1>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="signup-form"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Signup
            </Button>
          </Form.Item>

          <Text className="text-black transition duration-300">
            Already have an account?{' '}
            <span onClick={props.onFlip} className="cursor-pointer font-black">
              Login
            </span>
          </Text>
        </Form>
      </div>
    </div>
  );
}

export default Signup;
