import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Your Stream API credentials - in production, these should be in environment variables
const apiKey = 'hzjb5h6q7kmu';
// Replace with your actual Stream API secret
// You can find this in your Stream dashboard: https://dashboard.getstream.io/
// IMPORTANT: In production, this should be in an environment variable, not hardcoded
const apiSecret = 'cmcufnvpseby5ey538wzt8vhhhmpndp3ajrq8w4sgg5twc7kzup8jqjdn9ktmdgw'; 

export async function POST(request: Request) {
  try {
    const { userId, userName } = await request.json();
    
    if (!userId || !userName) {
      return NextResponse.json({ error: 'userId and userName are required' }, { status: 400 });
    }

    // Create a JWT token for the user that works with Stream Video SDK
    const payload = {
      user_id: userId,
      name: userName,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
      iss: 'https://pronto.getstream.io',
      sub: `user/${userId}`
    };

    const token = jwt.sign(payload, apiSecret, { algorithm: 'HS256' });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}