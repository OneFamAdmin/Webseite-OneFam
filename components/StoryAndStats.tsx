// import React from 'react';
// import FancyGradient from './FancyGradient';
// import MaxWidth from './MaxWidth';
// import { useTranslations } from 'next-intl';

// const StoryAndStats = () => {
//   const t = useTranslations('story_and_stats');

//   const tripArray = [
//     {
//       title: t('tripCovered'),
//       count: '100%',
//     },
//     {
//       title: t('adventures'),
//       count: '01',
//     },
//     {
//       title: t('members'),
//       count: '1000+',
//     },
//   ];
//   return (
//     <div className='relative -z-10  bg-[#0D0D0D]'>
//       <FancyGradient className='absolute top-0 -left-0 w-[50px] h-[600px] overflow-hidden ' />
//       <FancyGradient className='absolute top-0 -right-0  w-[50px] h-[600px]  overflow-hidden ' />
//       <MaxWidth className='flex flex-col items-center justify-center gap-8 py-16'>
//         <div className='flex flex-col items-center'>
//           <h1
//             data-aos='fade-up'
//             data-aos-duration='1000'
//             data-aos-delay='200'
//             data-aos-anchor-placement='top-bottom'
//             className='text-[48px] sm:text-[48px] md:text-[55px] md-1:text-[60px] md-2:text-[80px]  lg:text-[80px] lg-1:text-[80px] xl-2:text-[80px] font-newyork font-normal'
//           >
//             {t('title')}
//           </h1>
//           <h2
//             data-aos='fade-up'
//             data-aos-duration='1000'
//             data-aos-delay='200'
//             data-aos-anchor-placement='top-bottom'
//             className='text-[28px] md:text-[32px] md-1:text-[36px] md-2:text-[48px]  lg:text-[48px] lg-1:text-[48px] xl-2:text-[48px] font-outfit font-light text-center'
//           >
//             {t('subTitle')}
//           </h2>
//         </div>
//         <div className='space-y-4'>
//           <p
//             data-aos='fade-up'
//             data-aos-duration='2000'
//             data-aos-delay='400'
//             data-aos-anchor-placement='top-bottom'
//             className='font-outfit font-light  text-center'
//           >
//             {t('description1')}
//           </p>
//           <p
//             data-aos='fade-up'
//             data-aos-duration='1000'
//             data-aos-delay='400'
//             data-aos-anchor-placement='top-bottom'
//             className='font-outfit font-light  text-center max-w-[942px]'
//           >
//             {t('description2')}
//           </p>
//         </div>
//         <div className=' grid grid-cols-2 md-2:grid-cols-3 gap-4 mt-6'>
//           {tripArray?.map((trip, index) => (
//             <div
//               key={index}
//               className={`bg-[#C131BF]/10 flex flex-col items-center justify-center px-8 py-2  ${tripArray.length - 1 === index ? 'col-span-2 md-2:col-span-1' : ''}`}
//             >
//               <p
//                 data-aos='fade-up'
//                 data-aos-duration='1000'
//                 data-aos-delay='400'
//                 data-aos-anchor-placement='top-bottom'
//                 className=' text-[24px] font-normal font-outfit  text-center'
//               >
//                 {trip.count}
//               </p>
//               <h4
//                 data-aos='fade-up'
//                 data-aos-duration='2000'
//                 data-aos-delay='200'
//                 data-aos-anchor-placement='top-bottom'
//                 className='font-outfit font-light text-center'
//               >
//                 {trip.title}
//               </h4>
//             </div>
//           ))}
//         </div>
//       </MaxWidth>
//     </div>
//   );
// };

// export default StoryAndStats;
