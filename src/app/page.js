'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Paper, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [filterText, setFilterText] = useState('')

  const updateInventory = async () => {
    try {
      console.log('Fetching inventory...')
      const snapshot = query(collection(firestore, 'inventory'))
      const docs = await getDocs(snapshot)
      const inventoryList = docs.docs.map((doc) => ({ name: doc.id, ...doc.data() }))
      setInventory(inventoryList)
      setFilteredInventory(inventoryList)
      console.log('Inventory fetched:', inventoryList)
    } catch (error) {
      console.error('Error fetching inventory:', error)
    }
  }

  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    setFilteredInventory(
      inventory.filter((item) =>
        item.name.toLowerCase().includes(filterText.toLowerCase())
      )
    )
  }, [filterText, inventory])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1 })
      } else {
        await setDoc(docRef, { quantity: 1 })
      }
      await updateInventory()
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        if (quantity === 1) {
          await deleteDoc(docRef)
        } else {
          await setDoc(docRef, { quantity: quantity - 1 })
        }
      }
      await updateInventory()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
      p={3}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Typography variant="h4" gutterBottom>
        Pantry Items
      </Typography>
      <Box width="80%" maxWidth={800} mt={3} display="flex" justifyContent="space-between" alignItems="center">
        <Button variant="contained" onClick={handleOpen} startIcon={<AddIcon />}>
          Add New Item
        </Button>
        <TextField
          id="filter"
          label="Filter items"
          variant="outlined"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </Box>
      <Paper elevation={3} sx={{ width: '80%', maxWidth: 800, mt: 3 }}>
        <Box
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderBottom="1px solid #333"
        >
          <Typography variant="h4" color="#333" textAlign="center">
            Inventory
          </Typography>
        </Box>
        <Stack
          width="100%"
          height="300px"
          spacing={2}
          overflow="auto"
          p={2}
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Paper
              key={name}
              sx={{
                width: '100%',
                minHeight: '100px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                bgcolor: '#f0f0f0',
              }}
            >
              <Typography variant="h5" color="#333">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#333">
                Quantity: {quantity}
              </Typography>
              <IconButton
                color="primary"
                onClick={() => addItem(name)}
              >
                <AddIcon />
              </IconButton>
              <IconButton
                color="secondary"
                onClick={() => removeItem(name)}
              >
                <RemoveIcon />
              </IconButton>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Box>
  )
}


