export default function CheckoutSuccessPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
      <div className='max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center'>
        <div className='mb-4 text-4xl'>🎉</div>
        <h1 className='mb-2 text-2xl font-bold text-gray-900'>
          Welcome aboard!
        </h1>
        <p className='mb-4 text-gray-600'>
          Your subscription is active. Check your email for a link to set up
          your account.
        </p>
        <a
          href='/'
          className='inline-block rounded-lg bg-gray-900 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800'
        >
          Go to homepage
        </a>
      </div>
    </div>
  );
}
