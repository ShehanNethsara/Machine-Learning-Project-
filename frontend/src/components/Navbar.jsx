import React, { useState } from 'react'
import { Activity, BarChart2, Cpu, Menu, Shield, X, } from 'react-feather' 

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const navigation = [
    {
      label: 'Dashboard',
      href: '#dashboard',
      icon: BarChart2,
    },
    {
      label: 'Prediction',
      href: '#prediction',
      icon: Cpu,
    },
    {
      label: 'Performance',
      href: '#performance',
      icon: Activity,
    },
  ];

  
}

export default Navbar
