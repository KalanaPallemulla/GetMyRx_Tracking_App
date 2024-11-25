import React from 'react';
import CustomerOrderCard from './CustomerOrderCard';

const CustomerOrders = () => {
  const sampleOrders = [
    {
      id: 1,
      status: 'Pending',
      date: 'May 15, 2023',
      address: '123 Main St, Anytown, USA',
      pharmacyName: 'HealthCare Pharmacy',
      images: [
        'https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg',
        'https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg',
      ],
    },
    {
      id: 2,
      status: 'Delivered',
      date: 'May 12, 2023',
      address: '456 Elm St, Somewhere, USA',
      pharmacyName: 'QuickMeds Drugstore',
      images: [
        'https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg',
      ],
    },
    {
      id: 3,
      status: 'Processing',
      date: 'May 18, 2023',
      address: '789 Oak St, Nowhere, USA',
      pharmacyName: 'Community Health Pharmacy',
      images: [
        'https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg',
        'https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg',
        'https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg',
      ],
    },
  ];

  return <CustomerOrderCard orders={sampleOrders} />;
};

export default CustomerOrders;
