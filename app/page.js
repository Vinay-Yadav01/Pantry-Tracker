'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { collection, setDoc, getDoc, getDocs, doc, query, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList); // Update filtered inventory
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term === '') {
      setFilteredInventory(inventory);
    } else {
      const filtered = inventory.filter(item => item.name.toLowerCase().includes(term.toLowerCase()));
      setFilteredInventory(filtered);
    }
  };

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2} sx={{ backgroundColor: '#f7f7f7', fontFamily: 'Comic Sans MS' }}>
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: "translate(-50%, -50%)", backgroundColor: '#fff5e6' }}>
          <Typography variant="h6" sx={{ textAlign: 'center', fontFamily: 'Comic Sans MS' }}>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant='outlined' fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} sx={{ backgroundColor: 'white', borderRadius: '5px' }}></TextField>
            <Button variant="contained" onClick={() => { addItem(itemName); setItemName(''); handleClose() }} sx={{ backgroundColor: '#ff4081', color: 'white' }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Box width="800px" height="100px" display={"flex"} alignItems="center" justifyContent="center" paddingBlockStart={'50px'} paddingBlockEnd={'20px'}>
          <Typography variant="h2" sx={{ fontFamily: 'Comic Sans MS', color: '#3D0A57', fontSize: '4em', fontWeight: 'bold' }}>Pantry Tracker</Typography>
        </Box>

      <Button variant="contained" onClick={handleOpen} sx={{ backgroundColor: '#ff4081', color: 'white', fontFamily: 'Comic Sans MS', fontSize: '1.2em' }}>Add New Item</Button>
      
      <TextField 
        variant='outlined' 
        fullWidth 
        placeholder="Search items..." 
        value={searchTerm} 
        onChange={handleSearch} 
        sx={{ marginBottom: '20px', width: '800px', backgroundColor: 'white', borderRadius: '5px' }} 
      />
      
      <Box border='2px solid #ff4081' borderRadius='10px' sx={{ backgroundColor: '#fff3e0', padding: '20px' }}>
        <Box width="800px" height="100px" display={"flex"} alignItems="center" justifyContent="center" sx={{ backgroundColor: '#ffeb3b' }}>
          <Typography variant="h2" sx={{ fontFamily: 'Comic Sans MS', color: '#ff4081' }}>Inventory Items</Typography>
        </Box>

        <Stack width="800px" height="400px" overflow={"auto"} spacing={2}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box key={name} display="flex" justifyContent="space-between" alignItems="center" p={5} sx={{ backgroundColor: '#ffe0b2', borderRadius: '10px' }}>
              <Typography variant="h3" sx={{ color: '#ff4081', fontFamily: 'Comic Sans MS', textAlign: "center" }}>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
              <Typography variant="h3" sx={{ color: '#ff4081', fontFamily: 'Comic Sans MS', textAlign: "center" }}>{quantity}</Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => { addItem(name) }} sx={{ backgroundColor: '#ff4081', color: 'white' }}>Add</Button>
                <Button variant="contained" onClick={() => { removeItem(name) }} sx={{ backgroundColor: '#ff4081', color: 'white' }}>Remove</Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
