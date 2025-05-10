import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <Head>
        <title>Mikey.app - AI 图像生成服务</title>
        <meta name="description" content="世界上第一个完全免费的 AI 图像生成器" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative px-4 pt-6 pb-12 sm:px-6 lg:px-8 lg:pt-10 lg:pb-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Mikey AI</span>
            </h1>
            <p className="mt-3 text-base text-gray-600 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl">
              Create stunning AI-generated images in seconds
            </p>
            <p className="mt-1 text-sm text-gray-500 sm:mx-auto sm:max-w-xl md:text-base">
              World's First Unlimited Free AI Image Generator
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center rounded-full bg-blue-50 px-4 py-2">
                <span className="text-sm font-medium text-blue-700">100% Free</span>
              </div>
              <div className="flex items-center rounded-full bg-blue-50 px-4 py-2">
                <span className="text-sm font-medium text-blue-700">Powered by Flux.1-Dev</span>
              </div>
              <div className="flex items-center rounded-full bg-blue-50 px-4 py-2">
                <span className="text-sm font-medium text-blue-700">No Login Required</span>
              </div>
              <div className="flex items-center rounded-full bg-blue-50 px-4 py-2">
                <span className="text-sm font-medium text-blue-700">Unlimited Generations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Generator Section */}
        <div className="relative bg-white py-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
              <div className="space-y-6">
                <div>
                  <label htmlFor="prompt" className="sr-only">Prompt</label>
                  <textarea
                    id="prompt"
                    name="prompt"
                    rows={4}
                    className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                    placeholder="What will you create?"
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500">🇬🇧 Please use English for best results</p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Aspect Ratio</p>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1:1</button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm">3:4</button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm">4:3</button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm">9:16</button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm">16:9</button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <button className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Key Features of Mikey
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Experience the next generation of AI image generation - powerful, free, and privacy-focused
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Zero-Cost Creation
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Create as many high-quality images as you want, completely free with no hidden charges.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                    </div>
                    State-of-the-Art Quality
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Powered by cutting-edge technology for exceptional image quality and precise prompt understanding.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    </div>
                    Lightning-Fast Generation
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Optimized for speed, delivering beautiful images in seconds rather than minutes.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    Enhanced Privacy Protection
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Zero data retention policy ensures your prompts and images remain private and secure.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-blue-600 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Trusted by Millions
                </h2>
                <p className="mt-4 text-lg leading-8 text-blue-100">
                  Join the world's largest free AI image generator community
                </p>
              </div>
              <div className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-3 lg:grid-cols-3">
                <div className="flex flex-col items-center gap-y-2 bg-white/5 p-8 backdrop-blur-sm rounded-xl">
                  <dt className="text-base leading-7 text-blue-100">Active Users</dt>
                  <dd className="text-3xl font-semibold tracking-tight text-white">3M+</dd>
                </div>
                <div className="flex flex-col items-center gap-y-2 bg-white/5 p-8 backdrop-blur-sm rounded-xl">
                  <dt className="text-base leading-7 text-blue-100">Images Created</dt>
                  <dd className="text-3xl font-semibold tracking-tight text-white">1,530/min</dd>
                </div>
                <div className="flex flex-col items-center gap-y-2 bg-white/5 p-8 backdrop-blur-sm rounded-xl">
                  <dt className="text-base leading-7 text-blue-100">User Rating</dt>
                  <dd className="text-3xl font-semibold tracking-tight text-white">4.9</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* User Reviews Section */}
        <div className="py-24 sm:py-32 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                What Users Say About Mikey AI
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Hear from creators and professionals who use our AI image generator every day
              </p>
            </div>
            
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
              {/* Review 1 */}
              <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                <div>
                  <p className="text-lg font-semibold leading-6 text-gray-900">
                    "The quality is mind-blowing!"
                  </p>
                  <p className="mt-4 text-base text-gray-600">
                    I've tried many AI image generators, but Mikey consistently produces the most stunning results. The free unlimited generations make it even better.
                  </p>
                </div>
                <div className="mt-8 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">JD</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-semibold text-gray-900">James Davis</p>
                    <p className="text-sm text-gray-500">Digital Artist</p>
                  </div>
                </div>
              </div>
              
              {/* Review 2 */}
              <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                <div>
                  <p className="text-lg font-semibold leading-6 text-gray-900">
                    "Perfect for my marketing needs"
                  </p>
                  <p className="mt-4 text-base text-gray-600">
                    As a small business owner, Mikey has been a game-changer for creating professional visuals without the high costs of hiring designers.
                  </p>
                </div>
                <div className="mt-8 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">SL</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-semibold text-gray-900">Sarah Lee</p>
                    <p className="text-sm text-gray-500">Entrepreneur</p>
                  </div>
                </div>
              </div>
              
              {/* Review 3 */}
              <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                <div>
                  <p className="text-lg font-semibold leading-6 text-gray-900">
                    "Lightning fast and accurate"
                  </p>
                  <p className="mt-4 text-base text-gray-600">
                    I'm amazed by how well Mikey understands complex prompts. The speed is incredible too - no more waiting minutes for a single image.
                  </p>
                </div>
                <div className="mt-8 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">RK</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-semibold text-gray-900">Robert Kim</p>
                    <p className="text-sm text-gray-500">Game Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Have another question? <a href="#" className="text-blue-600 hover:text-blue-500">Contact us</a>
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-2xl divide-y divide-gray-900/10">
              {/* FAQ Item 1 */}
              <details className="group py-4 marker:content-['']">
                <summary className="flex w-full cursor-pointer select-none justify-between text-left text-base font-semibold leading-7 text-gray-900">
                  <span>What is Mikey AI?</span>
                  <span className="flex h-7 items-center">
                    <svg className="h-6 w-6 group-open:hidden" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>
                    <svg className="hidden h-6 w-6 group-open:block" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-3 pr-12 text-base leading-7 text-gray-600">
                  <p>Mikey AI is a unlimited free image generator that converts text descriptions into stunning, high-resolution images using advanced artificial intelligence algorithms. It's designed for artists, designers, and anyone who wants to bring their creative visions to life.</p>
                </div>
              </details>
              
              {/* FAQ Item 2 */}
              <details className="group py-4 marker:content-['']">
                <summary className="flex w-full cursor-pointer select-none justify-between text-left text-base font-semibold leading-7 text-gray-900">
                  <span>How does Mikey AI Image Generator Work?</span>
                  <span className="flex h-7 items-center">
                    <svg className="h-6 w-6 group-open:hidden" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>
                    <svg className="hidden h-6 w-6 group-open:block" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-3 pr-12 text-base leading-7 text-gray-600">
                  <p>Mikey AI Image Generator works by analyzing the text prompts you provide and using machine learning models to generate visual content that matches your descriptions. It combines various artistic styles and elements to create unique and high-quality images.</p>
                </div>
              </details>
              
              {/* FAQ Item 3 */}
              <details className="group py-4 marker:content-['']">
                <summary className="flex w-full cursor-pointer select-none justify-between text-left text-base font-semibold leading-7 text-gray-900">
                  <span>Do I need to be an artist to use it?</span>
                  <span className="flex h-7 items-center">
                    <svg className="h-6 w-6 group-open:hidden" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>
                    <svg className="hidden h-6 w-6 group-open:block" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-3 pr-12 text-base leading-7 text-gray-600">
                  <p>No, you don't need to be an artist. Mikey AI Image Generator is designed to be user-friendly and accessible to everyone. Whether you're a professional artist or a casual user, you can easily create amazing art with just a few text prompts.</p>
                </div>
              </details>
              
              {/* FAQ Item 4 */}
              <details className="group py-4 marker:content-['']">
                <summary className="flex w-full cursor-pointer select-none justify-between text-left text-base font-semibold leading-7 text-gray-900">
                  <span>Is there a limit to the number of images I can generate?</span>
                  <span className="flex h-7 items-center">
                    <svg className="h-6 w-6 group-open:hidden" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>
                    <svg className="hidden h-6 w-6 group-open:block" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-3 pr-12 text-base leading-7 text-gray-600">
                  <p>No, there is no limit to the number of images you can generate with Mikey AI Image Generator. You can create as many images as you want without any restrictions.</p>
                </div>
              </details>
              
              {/* FAQ Item 5 */}
              <details className="group py-4 marker:content-['']">
                <summary className="flex w-full cursor-pointer select-none justify-between text-left text-base font-semibold leading-7 text-gray-900">
                  <span>How long does it take to generate an image?</span>
                  <span className="flex h-7 items-center">
                    <svg className="h-6 w-6 group-open:hidden" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>
                    <svg className="hidden h-6 w-6 group-open:block" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-3 pr-12 text-base leading-7 text-gray-600">
                  <p>The time it takes to generate an image depends on the complexity of the text prompt and the style you choose. Typically, it takes just a few seconds for the AI to produce high-quality images.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-gray-900">
          <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex justify-center space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Privacy Policy</span>
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Terms & Conditions</span>
                Terms & Conditions
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">About</span>
                About
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Contact</span>
                Contact
              </a>
            </div>
            <div className="mt-8 md:order-1 md:mt-0">
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-xl font-bold text-white">Mikey</span>
              </div>
              <p className="mt-2 text-center text-xs leading-5 text-gray-400 md:text-left">
                &copy; 2025 Mikey AI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
} 