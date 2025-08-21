import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { ArrayInput } from './ArrayInput';
import { Input } from './Input';

export function ArrayInputWithValidation() {
  const [skills, setSkills] = useState(['JavaScript', 'React']);
  const [errors, setErrors] = useState([]);

  const validateSkills = (newSkills: string[]) => {
    const newErrors: string[] = [];
    if (newSkills.length < 1) {
      newErrors.push('At least one skill is required');
    }
    if (newSkills.length > 5) {
      newErrors.push('Maximum 5 skills allowed');
    }
    setErrors(newErrors);
  };

  const handleChange = (newSkills: string[]) => {
    setSkills(newSkills);
    validateSkills(newSkills);
  };

  return (
    <div className='space-y-4'>
      <ArrayInput
        label='Skills'
        value={skills}
        onChange={handleChange}
        allowReorder
        minItems={1}
        maxItems={5}
        errors={errors}
        helperText='Add your technical skills (1-5 items)'
      >
        {({
          index,
          value,
          onChange,
          onRemove,
          onMoveUp,
          onMoveDown,
          canReorder,
        }) => (
          <div key={index} className='flex gap-2 items-center'>
            {canReorder && (
              <Button onClick={onMoveUp} variant='outline' size='sm'>
                ↑
              </Button>
            )}
            <Input
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder='Skill name'
              className='flex-1'
            />
            {canReorder && (
              <Button onClick={onMoveDown} variant='outline' size='sm'>
                ↓
              </Button>
            )}
            <Button onClick={onRemove} variant='outline' size='sm'>
              Remove
            </Button>
          </div>
        )}
      </ArrayInput>

      <div className='text-sm text-gray-600'>
        <strong>Current skills:</strong> {skills.join(', ')}
      </div>
    </div>
  );
}
