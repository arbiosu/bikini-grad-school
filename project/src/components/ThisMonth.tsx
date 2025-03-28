export default function ThisMonth() {
  return (
    <section>
      <div className='mx-auto max-w-screen-xl px-4 py-8 text-center lg:py-16'>
        <h1 className='mb-4 text-4xl font-extrabold leading-none tracking-tight text-custom-pink-text md:text-5xl lg:text-6xl'>
          This Month
        </h1>
        <p className='mb-8 text-lg font-normal text-custom-pink-text sm:px-16 lg:px-48 lg:text-xl'>
          Under construction{' '}
        </p>
        <div className='flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0'>
          <a
            href='#'
            className='inline-flex items-center justify-center rounded-lg bg-pink-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-pink-950 focus:ring-4 focus:ring-blue-300'
          >
            Get zine
            <svg
              className='ms-2 h-3.5 w-3.5 rtl:rotate-180'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 10'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M1 5h12m0 0L9 1m4 4L9 9'
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
