const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Task = require('../models/Task')
const authenticate = require('../middleware/authenticate')



// Create new task
router.post('/create', authenticate, async (req, res) => { 
    try {
        const { owner_id, name, description, date, duration, priority, solved, recycling_bin } = req.body
  
        //Find user
        const owner = await User.findOne({ _id: owner_id })
        if (!owner) { 
        return res.status(400).json({ message: 'User doesnt exist' })
        }

        const newTask = new Task({
          owner_id,
          name,
          description,
          date,
          duration,
          priority,
          solved,
          recycling_bin
        })
    
        await newTask.save()

        owner.task_Ids.push(newTask._id);
        await owner.save();

      
        return res.status(201).json({ message: 'Task created', newTask })
      } catch (err) {
        console.error(err)
        return res.status(400).send(err.message)
      }
  })

//Delete task
router.delete('/delete', authenticate, async (req, res) => { 
    try {
        const { task_id } = req.body

        const task = await Task.findOne({ _id: task_id })
        if (!task) {
            return res.status(400).json({ message: 'Task not found' })
        }

        const owner_id = task.owner_id

        await Task.findOneAndDelete({ _id: task_id })

        const owner = await User.findByIdAndUpdate(
            owner_id,
            { $pull: { task_Ids: task_id } },
            { new: true }
        );

        if (!owner) {
            return res.status(400).json({ message: 'User not found' })
        }

        return res.status(200).json({ message: 'Task deleted and owner updated', taskIds: owner.task_Ids })
      } catch (err) {
        console.error(err)
        return res.status(400).send(err.message)
      }
  })

// Edit task
router.post('/edit', authenticate, async (req, res) => { 
    try {
        const { _id, name, description, date, duration, priority } = req.body
  
        const task = await Task.findOne({ _id: _id })
        if (!task) { 
        return res.status(400).json({ message: 'Task not found' })
        }

        const editedTask = await Task.findByIdAndUpdate(_id, {
            name: name || task.name,
            description: description || task.description,
            date: date || task.date,
            duration: duration || task.duration,
            priority: priority || task.priority
        }, { new: true })

      
        return res.status(201).json({ message: 'Task successfully edited', editedTask })
      } catch (err) {
        console.error(err)
        return res.status(400).send(err.message)
      }
  })

// Change state
router.post('/changeState', authenticate, async (req, res) => { 
    try {
        const { _id, newState } = req.body
  
        const task = await Task.findOne({ _id: _id })
        if (!task) { 
        return res.status(400).json({ message: 'Task not found' })
        }

        const editedTask = await Task.findByIdAndUpdate(_id, {
            solved: newState
        }, { new: true })

      
        return res.status(201).json({ message: 'Task successfully edited', editedTask })
      } catch (err) {
        console.error(err)
        return res.status(400).send(err.message)
      }
  })

  // Handle Recycling bin
router.post('/changeRecyclingBin', authenticate, async (req, res) => { 
    try {
        const { _id, recycling_bin } = req.body
  
        const task = await Task.findOne({ _id: _id })
        if (!task) { 
        return res.status(400).json({ message: 'Task not found' })
        }

        const editedTask = await Task.findByIdAndUpdate(_id, {
            recycling_bin: recycling_bin
        }, { new: true })

      
        return res.status(201).json({ message: 'Task successfully edited', editedTask })
      } catch (err) {
        console.error(err)
        return res.status(400).send(err.message)
      }
  })

// Get today tasks
router.get('/getToday', authenticate, async (req, res) => {
    const user = req.query.user
    const sort = req.query.sort

    const owner = await User.findOne({ _id: user })
        if (!owner) { 
        return res.status(400).json({ message: 'User doesnt exist' })
        }

        const today = new Date().toISOString().split('T')[0]
        const tasks = await Task.find({
            owner_id: user,
            date: { $gte: `${today}T00:00:00.000Z`, $lt: `${today}T23:59:59.999Z` },
            solved: false,
            recycling_bin: false
        })

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for today' })
        }

        if (sort === "prior_1-5") {
            tasks.sort((a, b) => a.priority - b.priority)
            return res.status(200).json({ tasks })
        }

        if (sort === "prior_5-1") {
            tasks.sort((a, b) => b.priority - a.priority)
            return res.status(200).json({ tasks })
        }

        if (sort === "first") { 
            tasks.sort((a, b) => new Date(a.date) - new Date(b.date))
            return res.status(200).json({ tasks })
        }

        if (sort === "last") { 
            tasks.sort((a, b) => new Date(b.date) - new Date(a.date))
            return res.status(200).json({ tasks })
        }
        
})

// Get this week
router.get('/getThisWeek', authenticate, async (req, res) => {
    const user = req.query.user
    const sort = req.query.sort

    try {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)

        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay() + 1)

        const endOfWeek = new Date(today)
        endOfWeek.setDate(today.getDate() + (7 - today.getDay()))

        const tasks = await Task.find({
            owner_id: user,
            date: {
                $gte: tomorrow.toISOString(),
                $lt: endOfWeek.toISOString()
            },
            solved: false,
            recycling_bin: false
        });

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No active tasks found for this week' });
        }

        if (sort === "prior_1-5") {
            tasks.sort((a, b) => a.priority - b.priority)
            return res.status(200).json({ tasks })
        }

        if (sort === "prior_5-1") {
            tasks.sort((a, b) => b.priority - a.priority)
            return res.status(200).json({ tasks })
        }

        if (sort === "first") { 
            tasks.sort((a, b) => new Date(a.date) - new Date(b.date))
            return res.status(200).json({ tasks })
        }

        if (sort === "last") { 
            tasks.sort((a, b) => new Date(b.date) - new Date(a.date))
            return res.status(200).json({ tasks })
        }
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
})

// Get later
router.get('/getLater', authenticate, async (req, res) => {
    const user = req.query.user
    const sort = req.query.sort

    try {
        const today = new Date()
        
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay() + 1)

        const endOfWeek = new Date(today)
        endOfWeek.setDate(today.getDate() + (7 - today.getDay()))

        const tasks = await Task.find({
            owner_id: user,
            date: {
                $gt: endOfWeek.toISOString() 
            },
            solved: false,
            recycling_bin: false
        })

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found' })
        }

        if (sort === "prior_1-5") {
            tasks.sort((a, b) => a.priority - b.priority)
            return res.status(200).json({ tasks })
        }

        if (sort === "prior_5-1") {
            tasks.sort((a, b) => b.priority - a.priority)
            return res.status(200).json({ tasks })
        }

        if (sort === "first") { 
            tasks.sort((a, b) => new Date(a.date) - new Date(b.date))
            return res.status(200).json({ tasks })
        }

        if (sort === "last") { 
            tasks.sort((a, b) => new Date(b.date) - new Date(a.date))
            return res.status(200).json({ tasks })
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
})

// Get archive
router.get('/getArchive', authenticate, async (req, res) => {
    const user = req.query.user

    try {
        const tasks = await Task.find({
            owner_id: user,
            solved: true,
            recycling_bin: false
        })

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found' })
        }

        return res.status(200).json({ tasks });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
})

// Get recycling bin
router.get('/getRecyclingBin', authenticate, async (req, res) => {
    const user = req.query.user

    try {
        const tasks = await Task.find({
            owner_id: user,
            recycling_bin: true
        })

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found' })
        }

        return res.status(200).json({ tasks });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router