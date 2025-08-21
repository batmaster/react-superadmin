import React from 'react';

// Import components locally for live code blocks
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { BooleanInput } from '../../components/ui/BooleanInput';
import { Button } from '../../components/ui/Button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../../components/ui/Card';
import { DateInput } from '../../components/ui/DateInput';
import { Dropdown } from '../../components/ui/Dropdown';
import { Label } from '../../components/ui/Label';
import { Modal } from '../../components/ui/Modal';
import { SelectInput } from '../../components/ui/SelectInput';

// Define the scope for live code blocks
const ReactLiveScope = {
  React,
  ...React,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Modal,
  Alert,
  Badge,
  Dropdown,
  Label,
  SelectInput,
  DateInput,
  BooleanInput,
};

export default ReactLiveScope;
