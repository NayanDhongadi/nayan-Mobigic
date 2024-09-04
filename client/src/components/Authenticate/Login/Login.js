import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';

const { Title, Text } = Typography;

function Login(props) {
  const history = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const { username, password } = values;

    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const res = await response.json();

        if (res.status === 200 && res.result && res.result.token) {
            localStorage.setItem('userdatatoken', res.result.token);

            if (username) {
                localStorage.setItem('username', username);
            }

            message.success('Login successful!');
            history('/');
            form.resetFields();
        } else {
            message.error(res.error || 'Login failed. Please try again.');
        }
    } catch (err) {
        console.error('Error:', err);
        message.error('Error occurred during login. Please check the console for more details.');
    }
};








  return (
    <div className="login">
      <div className="login-form-container">
        <h1 className="text-4xl text-center font-bold text-blue-600 my-6">
          <span className="text-blue-800">L</span>ogin
        </h1>

        <Form
          form={form}
          onFinish={handleSubmit} 
          layout="vertical"
          className="login-form"
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
              Login
            </Button>
          </Form.Item>

          <Text className="text-black transition duration-300">
            Don't have an account?{' '}
            <span onClick={props.onFlip} className="cursor-pointer font-black">
              Sign up
            </span>
          </Text>
        </Form>
      </div>
    </div>
  );
}

export default Login;
