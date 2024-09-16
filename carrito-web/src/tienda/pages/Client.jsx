import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';
import { usePurchaseStore } from '../../hooks'
import React, { useState } from 'react'

export const Client = () => {
    const { clientes } = usePurchaseStore();
    const [filterType, setFilterType] = useState(''); // Estado para el filtro por tipo
    
    // Filtra los clientes según el tipo seleccionado
    const filteredClientes = filterType
    ? clientes.filter(cliente => cliente.tipo === filterType || filterType === 'TODOS')
    : clientes;
  
      console.log(filterType)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-[80%] max-w-4xl">
          <h1 className="text-center mb-4">Lista de clientes</h1>
  
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccione el Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo</SelectLabel>
                <SelectItem value="TODOS">Todos</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="COMUN">COMUN</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
  
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Antiguedad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map(cliente => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.id}</TableCell>
                  <TableCell>{cliente.nombre}</TableCell>
                  <TableCell>{cliente.apellido}</TableCell>
                  <TableCell>{cliente.dni}</TableCell>
                  <TableCell>{cliente.tipo}</TableCell>
                  <TableCell>{cliente.antiguedad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };
  