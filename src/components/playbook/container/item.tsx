import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Item({ playbookItem }) {
  return (
    <Card className='flex flex-col justify-between w-100 rounded-2xl shadow-md '>
      <div className=''>
        <CardHeader className='flex flex-row items-center space-x-3'>
          <img
            className='h-9 w-9'
            src='https://app.feedops.com/packs/media/google/google-merchant-center-6aab87d5.png'
            alt=''
          />
          <CardTitle className='text-lg'>{playbookItem.title}</CardTitle>
        </CardHeader>

        <CardContent>
          <CardDescription>{playbookItem.description}</CardDescription>
        </CardContent>
      </div>
      <CardFooter>
        <Link
          className='w-full flex items-center justify-center'
          to={playbookItem.url}
        >
          <Button className='w-full bg-green-600 hover:bg-green-700'>
            {playbookItem.buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
