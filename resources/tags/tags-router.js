const express = require('express')

const db = require('./tags-model.js')

const router = express.Router()

// GET ALL TAGS
router.get('/', (req, res) => {
    db.find()
        .then(tags => {
            res.json(tags)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "There was an error retrieving the tags!" })
        })
})

// GET SPECIFIC TAG
router.get('/:id', (req, res) => {
    const id = req.params.id;

    db.findTagById(id)
        .then(tag => {
            if (tag) {
                res.status(200).json(tag)
            } else {
                res.status(404).json({ errorMessage: "No such tag with that ID exists." })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "There was an error retrieving the tag!" })
        })
})

// ADD NEW TAG (POST) 
router.post('/', (req, res) => {
    const tagData = req.body;

    db.add(tagData)
        .then(tag => {
            if (!req.body.tag_name) {
                res.status(401).json({ errorMessage: "Please include the tag name." })
            } else {
                res.status(201).json(tag)
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "There was an error adding the tag." })
        })
})

// UPDATE EXISTING TAG (PUT)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db.findTagById(id)
        .then(tag => {
            if (tag) {
                db.update(changes, id)
                    .then(updatedTag => {
                        res.status(200).json(updatedTag)
                    })
            } else {
                res.status(404).json({ errorMessage: "No such tag with that ID exists." })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "There was an error updating the tag." })
        })
})

// DELETE EXISTING TAG
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(200).json({ removed: deleted })
            } else {
                res.status(404).json({ errorMessage: "No such tag with that ID exists." })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "There was an error deleting the tag." })
        })
})

module.exports = router;