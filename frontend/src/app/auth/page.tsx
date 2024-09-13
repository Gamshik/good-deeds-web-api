'use client';

import { useSearchParams } from 'next/navigation';
import LoginForm from '../components/forms/login.form';
import RegisterForm from '../components/forms/register.form';
import './page.scss';
import { Suspense } from 'react';

export default function UserFormSelector() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserFormSelectorInner />
    </Suspense>
  );
}

function UserFormSelectorInner() {
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode');

  let form;
  let helperText;
  let action;
  let linkForAction;

  if (mode === 'login') {
    form = <LoginForm />;
    helperText = "Don't have an account yet?";
    action = 'Create account';
    linkForAction = 'http://localhost:3000/auth?mode=register';
  } else if (mode === 'register') {
    form = <RegisterForm />;
    helperText = 'Do you already have an account?';
    action = 'Login in account';
    linkForAction = 'http://localhost:3000/auth?mode=login';
  }

  return (
    <main className="root grid">
      <div className="h-36"></div>
      <div className="grid gap-8 justify-items-center content-center">
        <h1 className="font-sans text-2xl">Welcome</h1>
        <p className="text-xl">
          On this site you can do good deeds, make friends and share your good deeds with them.
        </p>
        <div className="formWrap w-1/5">{form}</div>
        <p id="helper-text" className="mt-2 text-sm text-gray-500 ">
          {helperText}{' '}
          <a href={linkForAction} className="font-medium text-blue-600 hover:underline">
            {action}
          </a>
        </p>
      </div>
    </main>
  );
}