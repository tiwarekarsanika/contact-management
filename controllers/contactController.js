const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContact = asyncHandler(async (req, res) => {
    // res.send("Get all contacts.");
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});

//@desc Get a single contact
//@route GET /api/contacts/:id
//@access private
const getSingleContact = asyncHandler( async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found.");
    }
    res.status(200).json(contact);
});

//@desc Create a contact
//@route POST /api/contacts/
//@access private
const createContact = asyncHandler( async (req, res) => {
    console.log(req.body);
    const { name, email, phone } = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All feilds are mandatory!");
    }
    const contact = await Contact.create({
        name, email, phone,
        user_id: req.user.id
    });

    res.status(201).json(contact);
});

//@desc Update a contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler( async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found.");
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User doesn't have permission to update other users contacts.");
    }

    const updateContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.status(200).json(updateContact);
});

//@desc Delete a contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler( async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found.");
    };
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User doesn't have permission to update other users contacts.");
    }
    await Contact.deleteOne({_id: req.params.id});
    res.status(200).json(contact);
});


module.exports = {getContact, getSingleContact, createContact, updateContact, deleteContact};