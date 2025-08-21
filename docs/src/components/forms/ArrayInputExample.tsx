import React, { useState } from 'react';
import { ArrayInput } from './ArrayInput';
import { Input } from './Input';
import { Button } from '../ui/Button';

export function ArrayInputExample() {
  const [tags, setTags] = useState(['react', 'typescript']);

  return (
    <div className='space-y-4'>
      <ArrayInput label='Tags' value={tags} onChange={setTags}>
        {({ index, value, onChange, onRemove, canRemove }) => (
          <div key={index} className='flex gap-2 items-center'>
            <Input
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder='Enter tag'
              className='flex-1'
            />
            {canRemove && (
              <Button onClick={onRemove} variant='outline' size='sm'>
                Remove
              </Button>
            )}
          </div>
        )}
      </ArrayInput>

      <div className='text-sm text-gray-600'>
        <strong>Current tags:</strong> {tags.join(', ')}
      </div>
    </div>
  );
}
