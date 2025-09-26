import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ApplyButtonProps {
  email?: string;
  phone?: string;
}

export function ApplyButton({ email, phone }: ApplyButtonProps) {
  const getWhatsAppLink = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/90${cleaned.startsWith('0') ? cleaned.substring(1) : cleaned}`;
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 safe-bottom shadow-strong">
      <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
        {email && (
          <Button
            onClick={() => window.location.href = `mailto:${email}`}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-4 text-base font-semibold"
          >
            <Mail className="h-5 w-5" />
            E-posta ile Başvur
          </Button>
        )}
        
        {phone && (
          <>
            <div className="flex gap-3">
              <Button
                onClick={() => window.location.href = `tel:${phone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 py-4"
              >
                <Phone className="h-5 w-5" />
                Ara
              </Button>
            
              <Button
                onClick={() => window.open(getWhatsAppLink(phone), '_blank')}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-4"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}