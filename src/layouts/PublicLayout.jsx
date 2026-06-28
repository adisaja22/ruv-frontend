import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FormJualModal } from '../components/FormJualModal';

export const PublicLayout = ({ children }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch settings & stats
  const { data: homepageData } = useQuery({
    queryKey: ['publicHomepage'],
    queryFn: apiService.getHomepage,
    staleTime: 5 * 60 * 1000, // Cache for 5 mins
  });

  // Fetch contact data
  const { data: contactData } = useQuery({
    queryKey: ['publicContact'],
    queryFn: apiService.getContact,
    staleTime: 5 * 60 * 1000,
  });

  const whatsappNumber = homepageData?.settings?.nomor_whatsapp || contactData?.contact?.whatsapp || '6285353285071';

  // Pass necessary data and functions to page children
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { 
        onOpenForm: () => setIsFormOpen(true), 
        homepageData, 
        contactData 
      });
    }
    return child;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar 
        onOpenForm={() => setIsFormOpen(true)} 
        whatsappNumber={whatsappNumber} 
      />
      <main className="flex-grow">
        {childrenWithProps}
      </main>
      <Footer contact={contactData?.contact} />

      {/* Modal Form Jual Barang Bekas */}
      <FormJualModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        whatsappNumber={whatsappNumber}
      />
    </div>
  );
};
export default PublicLayout;
