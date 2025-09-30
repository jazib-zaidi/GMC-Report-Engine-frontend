import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ProductMetricsTable({ products }) {
  return (
    <Table className='mt-6'>
      <TableCaption>Product Metrics</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Offer ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Clicks</TableHead>
          <TableHead>Impressions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p, i) => (
          <TableRow key={i}>
            <TableCell className='font-mono text-xs'>
              {p.segments.offerId}
            </TableCell>
            <TableCell className='max-w-[250px] truncate'>
              {p.segments.title}
            </TableCell>
            <TableCell>{p.segments.brand}</TableCell>
            <TableCell className='text-blue-600 font-medium'>
              {p.metrics.clicks}
            </TableCell>
            <TableCell>{p.metrics.impressions}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
