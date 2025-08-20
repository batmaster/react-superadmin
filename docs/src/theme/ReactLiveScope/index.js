import React from 'react';

// Import components locally for live code blocks
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { Dropdown } from '../../components/ui/Dropdown';

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
