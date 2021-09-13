import { useState, useEffect } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodProps } from '../../types/food'
import { FoodsContainer } from './styles';

export function Dashboard() {
  const [foods, setFoods] = useState<FoodProps[]>([])
  const [editingFood, setEditingFood] = useState({} as FoodProps)
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false)
  const [isEditFoodModalOpen, setIsEditFoodModalOpen] = useState(false)

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get<FoodProps[]>('/foods')

      setFoods(response.data)
    }
    loadFoods();
  }, [])

  async function handleAddFood(food: FoodProps) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true
      })
      setFoods([...foods, response.data])
    } catch (error) {
      console.log(error)
    }
  }

  async function handleUpdateFood(food: FoodProps) {
    try {
      const updatedFood = await api.put(`/foods/${editingFood.id}`,
        { ...editingFood, ...food }
      );

      const updatedFoods = foods.map(food => food.id !== updatedFood.data.id ? food : updatedFood.data)

      setFoods(updatedFoods)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter(food => food.id !== id)

    setFoods(foodsFiltered)
  }

  function handleEditFood(food: FoodProps) {
    setEditingFood(food)
    setIsEditFoodModalOpen(true)
  }

  function toggleAddFoodModal() {
    setIsAddFoodModalOpen(!isAddFoodModalOpen)
  }

  function toggleEditFoodModal() {
    setIsEditFoodModalOpen(!isEditFoodModalOpen)
  }

  return (
    <>
      <Header openModal={toggleAddFoodModal} />
      <ModalAddFood
        isOpen={isAddFoodModalOpen}
        setIsOpen={toggleAddFoodModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditFoodModalOpen}
        setIsOpen={toggleEditFoodModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}
