import React from 'react';

// Import components locally for live code blocks
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../../components/ui/Card';
import { Dropdown } from '../../components/ui/Dropdown';
import { Modal } from '../../components/ui/Modal';

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
};

export default ReactLiveScope;
