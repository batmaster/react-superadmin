import React, { useState } from 'react';
import { ArrayInput } from './ArrayInput';
import { Input } from './Input';
import { Button } from '../ui/Button';

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export function ArrayInputComplex() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'USA',
    },
  ]);

  return (
    <div className='space-y-4'>
      <ArrayInput label='Addresses' value={addresses} onChange={setAddresses}>
        {({ index, value, onChange, onRemove, canRemove }) => (
          <div key={index} className='border p-4 rounded-lg space-y-3'>
            <div className='grid grid-cols-2 gap-3'>
              <Input
                label='Street'
                value={value.street}
                onChange={street => onChange({ ...value, street })}
              />
              <Input
                label='City'
                value={value.city}
                onChange={city => onChange({ ...value, city })}
              />
            </div>
            <div className='grid grid-cols-3 gap-3'>
              <Input
                label='State'
                value={value.state}
                onChange={state => onChange({ ...value, state })}
              />
              <Input
                label='ZIP'
                value={value.zip}
                onChange={zip => onChange({ ...value, zip })}
              />
              <Input
                label='Country'
                value={value.country}
                onChange={country => onChange({ ...value, country })}
              />
            </div>
            {canRemove && (
              <Button onClick={onRemove} variant='outline' size='sm'>
                Remove Address
              </Button>
            )}
          </div>
        )}
      </ArrayInput>

      <div className='text-sm text-gray-600'>
        <strong>Current addresses:</strong> {addresses.length} address(es)
      </div>
    </div>
  );
}
