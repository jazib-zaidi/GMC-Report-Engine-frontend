import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ProductStatusTable({ products }) {
  return (
    <Card>
      <Table className='mt-6'>
        <TableCaption>Feed Audit Products</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Destinations</TableHead>
            <TableHead>Issues</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, i) => (
            <TableRow key={i}>
              <TableCell className='font-mono text-xs'>
                {product.productId}
              </TableCell>
              <TableCell className='max-w-[250px] truncate'>
                <a
                  href={product.link}
                  target='_blank'
                  rel='noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  {product.title}
                </a>
              </TableCell>
              <TableCell>
                <ul className='space-y-1'>
                  {product.destinationStatuses.map((d, j) => (
                    <li
                      key={j}
                      className={
                        d.status === 'approved'
                          ? 'text-green-600 text-sm'
                          : 'text-red-600 text-sm'
                      }
                    >
                      {d.destination}:{' '}
                      <span className='font-medium'>{d.status}</span>
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>
                {product.itemLevelIssues?.length ? (
                  <ul className='space-y-2'>
                    {product.itemLevelIssues.map((issue, k) => (
                      <li key={k}>
                        <p className='font-semibold text-red-600 text-xs'>
                          {issue.code} ({issue.destination})
                        </p>
                        <p className='text-gray-600 text-xs'>
                          {issue.description}
                        </p>
                        <a
                          href={issue.documentation}
                          target='_blank'
                          rel='noreferrer'
                          className='text-[11px] text-blue-600 hover:underline'
                        >
                          Learn more
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className='text-gray-400 text-xs'>None</span>
                )}
              </TableCell>
              <TableCell className='text-xs'>
                {product.lastUpdateDate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
