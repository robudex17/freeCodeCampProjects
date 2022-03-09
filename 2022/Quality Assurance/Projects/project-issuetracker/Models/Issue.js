const mongoose = require('mongoose')
  
    const issueSchema = mongoose.Schema({
        project: {
            type:String,
            
        },
        issue_title: {
            type: String,
            required: true,
        }, 
        issue_text:{
          type: String,
          required: true
        },
        created_by: {
            type: String,
            required: true,
          
        },
        assigned_to: { 
            type: String,
           
        }, 
        status_text: { 
            type:String,
            
        }, 
        open: { 
            type:Boolean,
            
        },   
    
},{ timestamps: { 
        createdAt: 'created_on', // Use `created_on` to store the created date
        updatedAt: 'updated_on' // and `updated_on` to store the last updated date
    }
})

 module.exports = mongoose.model('Issue', issueSchema)
