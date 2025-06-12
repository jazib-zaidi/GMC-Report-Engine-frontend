import { useState, useEffect } from 'react';

export default function ProductTable({ product, isAi = false }) {
  const [products, setProducts] = useState(product);
  const [expandedItems, setExpandedItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(50);

  // Calculate index range for current page products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  useEffect(() => {
    setProducts(product);
    setCurrentPage(1);
  }, [product]);
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle products per page change
  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const toggleExpand = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };
  const escapeRegExp = (str) => {
    return str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&'); // Escape special characters
  };

  const highlightKeywords = (text, focusKeyword, id = 233) => {
    const selected = expandedItems[id];

    const keywords = focusKeyword?.split(' ');
    const escapedKeywords = keywords?.map(escapeRegExp);

    // Combine keywords into a regex that matches any of the words (using OR operator '|')
    const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');
    if (!selected) {
      return text;
    }
    if (!isAi) {
      return text;
    }
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const totalPages = Math.ceil(products.length / productsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='w-full '>
      <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
        <div className='grid grid-cols-12 border  text-black font-medium p-3'>
          <div className='col-span-1'>Item ID</div>
          <div className='col-span-6'>Product</div>
          <div className='col-span-4'>Focus Keyword </div>
          <div className='col-span-1'>Details</div>
        </div>

        {currentProducts.map((product) => (
          <div key={product['Item ID']} className='border-b border-gray-200'>
            <div className='grid grid-cols-12 p-3 items-center hover:bg-gray-50'>
              <div className='relative group ml-2'>
                <div className='col-span-1 text-gray-600 truncate mr-4'>
                  {product['Item ID']}
                </div>
                <div className='absolute bottom-full left-[150%] transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-gray-800 text-white text-xs rounded py-1 px-2  text-center'>
                  {product['Item ID']}
                </div>
              </div>
              <div className='col-span-6 text-sm truncate w-[90%]'>
                {highlightKeywords(
                  product['Title'],
                  product['Focus Keyword'],
                  product['Item ID']
                )}
              </div>
              <div
                className={`col-span-4 flex p-2 items-center  text-gray-600 truncate rounded-xl  ${
                  isAi
                    ? 'bg-gradient-to-r from-purple-50 to-purple-50  border-purple-300 border text-purple-800 font-medium'
                    : ''
                }`}
              >
                {isAi && (
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M9.6 5.613C7.91 5.466 6.98 4.874 6.484 3.7C6.305 3.277 6.18 2.783 6.1 2.2C6.1 2.1 6 2 5.9 2C5.8 2 5.7 2.1 5.7 2.2C5.62 2.783 5.495 3.277 5.316 3.7C4.821 4.874 3.891 5.466 2.2 5.613C2.1 5.613 2 5.713 2 5.813C2 5.913 2.1 6.013 2.2 6.013C4.3 6.413 5.4 7.2 5.7 9.4C5.7 9.5 5.8 9.6 5.9 9.6C6 9.6 6.1 9.5 6.1 9.4C6.4 7.2 7.5 6.413 9.6 6.013C9.7 6.013 9.8 5.913 9.8 5.813C9.8 5.713 9.7 5.613 9.6 5.613ZM19.469 11.865C15.469 11.065 13.743 9.135 12.943 5.236C12.9161 5.1305 12.8549 5.03688 12.7692 4.96976C12.6834 4.90265 12.5779 4.86581 12.469 4.865C12.3593 4.86587 12.253 4.90333 12.1669 4.97143C12.0809 5.03954 12.02 5.1344 11.994 5.241C11.985 5.247 12.001 5.226 11.994 5.241C11.194 9.241 9.369 11.065 5.469 11.865C5.33639 11.865 5.20921 11.9177 5.11545 12.0114C5.02168 12.1052 4.969 12.2324 4.969 12.365C4.969 12.4976 5.02168 12.6248 5.11545 12.7186C5.20921 12.8123 5.33639 12.865 5.469 12.865C9.469 13.665 11.186 15.552 11.986 19.452C12.0049 19.5667 12.0637 19.6711 12.1521 19.7467C12.2405 19.8223 12.3527 19.8642 12.469 19.865C12.5806 19.864 12.6885 19.8252 12.7751 19.7549C12.8618 19.6846 12.922 19.587 12.946 19.478C12.941 19.488 12.952 19.47 12.946 19.478C13.746 15.478 15.569 13.665 19.469 12.865C19.6016 12.865 19.7288 12.8123 19.8226 12.7186C19.9163 12.6248 19.969 12.4976 19.969 12.365C19.969 12.2324 19.9163 12.1052 19.8226 12.0114C19.7288 11.9177 19.6016 11.865 19.469 11.865ZM21.465 5.8C21.465 5.716 21.404 5.66 21.321 5.644L21.265 5.631C20.097 5.326 19.389 4.607 19.192 3.523C19.192 3.48242 19.1759 3.44351 19.1472 3.41481C19.1185 3.38612 19.0796 3.37 19.039 3.37V3.374C18.955 3.374 18.899 3.436 18.883 3.518L18.87 3.574C18.565 4.742 17.846 5.45 16.762 5.647C16.7214 5.647 16.6825 5.66312 16.6538 5.69181C16.6251 5.72051 16.609 5.75942 16.609 5.8H16.613C16.613 5.884 16.675 5.94 16.758 5.956L16.813 5.969C17.981 6.274 18.689 6.993 18.886 8.077C18.886 8.161 18.955 8.23 19.039 8.23V8.226C19.123 8.226 19.179 8.164 19.195 8.081L19.209 8.026C19.513 6.858 20.232 6.15 21.316 5.953C21.336 5.953 21.3557 5.94903 21.3741 5.9413C21.3925 5.93358 21.4092 5.92226 21.4231 5.90801C21.4371 5.89376 21.4481 5.87687 21.4555 5.85832C21.4628 5.83978 21.4654 5.81995 21.465 5.8ZM7.919 18.715C6.919 18.415 6.337 17.933 6.137 16.933C6.137 16.8752 6.11403 16.8197 6.07315 16.7789C6.03227 16.738 5.97682 16.715 5.919 16.715C5.86118 16.715 5.80573 16.738 5.76485 16.7789C5.72397 16.8197 5.701 16.8752 5.701 16.933C5.401 17.933 4.919 18.515 3.919 18.715C3.86118 18.715 3.80573 18.738 3.76485 18.7789C3.72397 18.8197 3.701 18.8752 3.701 18.933C3.701 18.9908 3.72397 19.0463 3.76485 19.0871C3.80573 19.128 3.86118 19.151 3.919 19.151C4.919 19.451 5.501 19.933 5.701 20.933C5.701 20.9908 5.72397 21.0463 5.76485 21.0871C5.80573 21.128 5.86118 21.151 5.919 21.151C5.97682 21.151 6.03227 21.128 6.07315 21.0871C6.11403 21.0463 6.137 20.9908 6.137 20.933C6.437 19.933 6.919 19.351 7.919 19.151C7.97682 19.151 8.03227 19.128 8.07315 19.0871C8.11403 19.0463 8.137 18.9908 8.137 18.933C8.137 18.8752 8.11403 18.8197 8.07315 18.7789C8.03227 18.738 7.97682 18.715 7.919 18.715Z'
                      fill='#866dc3'
                    ></path>
                  </svg>
                )}

                {product['Focus Keyword'] || 'Empty'}
              </div>

              <div className='col-span-1 ml-2'>
                <button
                  onClick={() => toggleExpand(product['Item ID'])}
                  className='p-1 rounded-full hover:bg-gray-200'
                >
                  {expandedItems[product['Item ID']] ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-blue-600'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-blue-600'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {expandedItems[product['Item ID']] && (
              <div className='p-4 bg-gray-50 border-t border-gray-200'>
                <h3 className='font-semibold text-lg mb-3 text-gray-600'>
                  Product Description
                </h3>
                <p className='text-gray-700 mb-4'>
                  {highlightKeywords(
                    product['Description'],
                    product['Focus Keyword'],
                    product['Item ID']
                  )}
                </p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3'>
                  <div>
                    <h4 className='font-semibold  text-gray-600 mb-2'>
                      Product Type
                    </h4>
                    <div className='bg-white p-3 rounded border border-gray-200'>
                      <table className='w-full text-sm'>
                        <tbody>
                          <tr>
                            <td className='font-medium py-1 pr-3 text-gray-600 w-1/3'>
                              1st Level:
                            </td>
                            <td className='py-1'>
                              {highlightKeywords(
                                product['Product Type (1st Level)'],
                                product['Focus Keyword'],
                                product['Item ID']
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className='font-medium py-1 pr-3 text-gray-600'>
                              2nd Level:
                            </td>
                            <td className='py-1'>
                              {highlightKeywords(
                                product['Product Type (2nd Level)'],
                                product['Focus Keyword'],
                                product['Item ID']
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className='font-medium py-1 pr-3 text-gray-600'>
                              3rd Level:
                            </td>
                            <td className='py-1'>
                              {highlightKeywords(
                                product['Product Type (3rd Level)'],
                                product['Focus Keyword'],
                                product['Item ID']
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className='font-medium py-1 pr-3 text-gray-600'>
                              4th Level:
                            </td>
                            <td className='py-1'>
                              {highlightKeywords(
                                product['Product Type (4th Level)'],
                                product['Focus Keyword'],
                                product['Item ID']
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className='font-medium py-1 pr-3 text-gray-600'>
                              5th Level:
                            </td>
                            <td className='py-1'>
                              {highlightKeywords(
                                product['Product Type (5th Level)'],
                                product['Focus Keyword'],
                                product['Item ID']
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className='font-semibold text-gray-700 mb-2'>
                      Google Category
                    </h4>
                    <div className='bg-white p-3 rounded border border-gray-200'>
                      <table className='w-full text-sm'>
                        <tbody>
                          <tr>
                            <td className='font-medium py-1 pr-3 text-gray-600 w-1/3'>
                              Category 1:
                            </td>
                            <td className='py-1'>
                              {highlightKeywords(
                                product['Google Product Category 1'],
                                product['Focus Keyword'],
                                product['Item ID']
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className='font-medium py-1 pr-3 text-gray-600'>
                              Category 2:
                            </td>
                            <td className='py-1'>
                              {highlightKeywords(
                                product['Google Product Category 2'],
                                product['Focus Keyword'],
                                product['Item ID']
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className='font-medium py-1 pr-3 text-gray-600'>
                              Category 3:
                            </td>
                            <td className='py-1'>
                              {highlightKeywords(
                                product['Google Product Category 3'],
                                product['Focus Keyword'],
                                product['Item ID']
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className='font-medium py-1 pr-3 text-gray-600'>
                              Category 4:
                            </td>
                            <td className='py-1'>
                              {highlightKeywords(
                                product['Google Product Category 4'],
                                product['Focus Keyword'],
                                product['Item ID']
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className='font-medium py-1 pr-3 text-gray-600'>
                              Category 5:
                            </td>
                            <td className='py-1'>
                              {highlightKeywords(
                                product['Google Product Category 5'],
                                product['Focus Keyword'],
                                product['Item ID']
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className='flex space-x-2'>
                  <span className='px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs'>
                    Item #{product['Item ID']}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='mt-4 flex justify-between items-center'>
        <div className='flex items-center'>
          <label className='mr-2'>Products per page:</label>
          <select
            value={productsPerPage}
            onChange={handleProductsPerPageChange}
            className='border p-2 rounded'
          >
            {[50, 100, 150, 250, 500].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className='flex space-x-2'>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className='px-3 py-1 bg-teal-500 text-white rounded disabled:bg-gray-200'
          >
            Previous
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {number}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className='px-3 py-1 bg-teal-500 text-white rounded disabled:bg-gray-200'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
