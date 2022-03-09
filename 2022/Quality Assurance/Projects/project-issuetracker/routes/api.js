'use strict';

const mongoose = require('mongoose')
const Issue = require('../Models/Issue')

//id = mongoose.Types.ObjectId('4edd40c86762e0fb12000003');


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get( async function (req, res,next){
      let project = req.params.project;
      let query = req.query
      let issues
      
      try{
        if(Object.keys(query).length === 0){
          issues =  await Issue.find().select('-__v').where({project})
          // console.log(query)
      
        }else{
          issues =  await Issue.find({}).select('-__v').where({project:project}).where(query)
          // console.log('with query paramater')
        }
      
      
        const data = issues.map(issue => {
          const d = {}
           d._id = mongoose.Types.ObjectId(issue._id)
           d.issue_title =issue.issue_title
           d.issue_text = issue.issue_text
           d.created_by =  issue.created_by
           d.assigned_to = issue.assigned_to || ''
           d.created_on  = issue.created_on
           d.updated_on = issue.updated_on
           d.status_text = issue.status_text || ''
           d.open = issue.open
           return d
        })
        // console.log(data)
        // console.log(issues)
        res.status(200).json(data)
      }catch(e){
        const error = {}
        error.error = new Error('Cannot read MongoDB').message
        next(error)
      }
      
      
      
    })
    
    .post(async function(req, res,next){
      let project = req.params.project;

    
      const data = {...req.body}
      data.open = true
      data.project = project

      try{
        const doc = await Issue(data).save()
        const _id = mongoose.Types.ObjectId(doc._id);
        // console.log(doc)
        res.status(201).json({
                              assigned_to:doc.assigned_to || '',
                              status_text:doc.status_text || '',
                              open: doc.open,
                              _id,
                              issue_title:doc.issue_title,
                              issue_text:doc.issue_text,
                              created_by:doc.created_by,
                              created_on:doc.created_on,
                              updated_on:doc.updated_on,
                           
                             })
      }catch (e) {
      //  console.log(e)
         const error = {}
         error.error = new Error( 'required field(s) missing' ).message
        next(error)
        
      }
    
    })
    
    .put(async function (req, res,next){
     
      let _id = req.body._id
      let doc = {...req.body}
      delete doc._id

      try {
        //if _id is not included 
        if(!_id){
         
          return res.status(200).json({error:'missing _id'})
        }
        //if there is not update object
        if(Object.keys(doc).length === 0){
        
          return res.status(200).json({error: 'no update field(s) sent', '_id': _id })
    
        }
         let updateDoc = await Issue.findByIdAndUpdate(_id,doc) // executes
          if(updateDoc){
          return res.status(200).json({result:'successfully updated', _id:_id})
          }else {
            return res.status(200).json({error: 'could not update', '_id': _id})
          }


      }catch(e){
        // console.log(e)
        const error = {}
        error.error =  new Error('Argument passed in must be a string of 12 bytes or a string of 24 hex characters').message
        next(error)
        
      }
      
      
    })
    
    .delete(async function (req, res,next){
      let project = req.params.project;

      let _id = req.body._id

      try{
           //if _id is not included 
        if(!_id){
         
          return res.status(200).json({error:'missing _id'})
        }
        const deleteDoc = await Issue.findByIdAndDelete(_id)
        if(deleteDoc){
          res.json({ result: 'successfully deleted', '_id': _id })
        }else{
          res.json({ error: 'could not delete', '_id': _id })
        }

      }catch(e){
      
        const error = {}
         error.error = new Error('Invalid Id').message
        next(error)
      }
    });
    
};
