import Image from '@/components/Image';

interface ArticleCardProps {
  imgUrl: string;
  title: string;
  author: string;
}

export function ArticleCard({ imgUrl, title, author }: ArticleCardProps) {
  return (
    <div className='mx-auto text-center'>
      <Image
        baseUrl={imgUrl}
        alt={`{title} by ${author}`}
        className='mb-4'
        sizes='(max-width: 1920px) 320px'
      />
      <p className='text-xl'>
        {title} <span className='text-indigo-300'>{author}</span>
      </p>
    </div>
  );
}
