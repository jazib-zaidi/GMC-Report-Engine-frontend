import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Download,
  RefreshCw,
} from 'lucide-react';
import ValidationDashboard from './ValidationDashboard';
import ProductTable from './ProductTable';
import { useAuth } from '@/context/AuthContext';

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  availability: string;
  link: string;
  image_link: string;
  brand?: string;
  gtin?: string;
  mpn?: string;
}

const FeedValidationTool = ({ domain }) => {
  const { auditFeedData } = useAuth();
  console.log(auditFeedData);
  return (
    <div className='min-h-screen '>
      <div className='container mx-auto px-6 py-8 max-w-7xl'>
        {/* Dashboard Overview */}
        <ValidationDashboard />
        <ProductTable
          products={auditFeedData || []}
          title='Products '
          icon={<AlertTriangle className='h-5 w-5 text-destructive' />}
          type='shortest'
        />
        {/* Main Content Tabs */}
        {/* <div className='mt-8'>
          <Tabs defaultValue='shortest' className='space-y-6'>
            <div className='flex items-center justify-between'>
              <TabsList className='grid w-full max-w-md grid-cols-3'>
                <TabsTrigger value='shortest'>Shortest Titles</TabsTrigger>
                <TabsTrigger value='longest'>Longest Titles</TabsTrigger>
                <TabsTrigger value='missing'>Short Descriptions</TabsTrigger>
              </TabsList>

              <div className='flex items-center gap-3'></div>
            </div>

            <TabsContent value='shortest'>
              <ProductTable
                products={titlesUnder40Chars}
                title='Products with Shortest Titles'
                icon={<AlertTriangle className='h-5 w-5 text-destructive' />}
                type='shortest'
              />
            </TabsContent>

            <TabsContent value='longest'>
              <ProductTable
                products={titleLargerThan150Chars}
                title='Products with Longest Titles'
                icon={<AlertTriangle className='h-5 w-5 text-destructive' />}
                type='longest'
              />
            </TabsContent>

            <TabsContent value='missing'>
              <ProductTable
                products={descriptionUnder500Chars}
                title='Products with Shortest Descriptions'
                icon={<AlertTriangle className='h-5 w-5 text-destructive' />}
                type='shortestDescription'
              />
            </TabsContent>
          </Tabs>
        </div> */}
      </div>
    </div>
  );
};

export default FeedValidationTool;
