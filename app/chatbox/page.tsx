'use client';

import Users from '@/(components)/Users';
import React, { useRef, useEffect, useState } from 'react';

export default function Chatbox() {
  return (
    <main className='container'>
      <h1>Chatbox Page</h1>
      <Users />
    </main>
  );
}
