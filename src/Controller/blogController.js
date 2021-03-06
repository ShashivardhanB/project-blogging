const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const mongoose = require("mongoose");

//-------------------------------------------------------------------//
// create Blog


const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true;
}
const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId)
}
const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).Length > 0
}


const createBlog = async function (req, res) {
  try {
    const requestBody = req.body;

    if (!isValidRequestBody(requestBody)) {
      res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide author detalls' })
      return
    }

    const { title, authorId, body, category, tags, subcategory, isPublished } = requestBody
    if (!isValid(title)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter the title" });
    }
    if (!isValidObjectId(authorId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter the autherid" });
    }
    if (!isValid(body)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter the body" });
    }
    if (!isValid(category)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter the category" });
    }

    const author = await authorModel.findById({ authorId });
    if (!author) {
      return res
        .status(400)
        .send({ status: false, msg: "no author" });
    }
    const blogData = {
      title,
      body,
      authorId,
      category,
      isPublished: isPublished ? isPublished : false,
      publishedAt: isPublished ? new Date() : null
    }
    if (tags) {
      if (Array.isArray(tags)) {
        blogData['tags'] = [...tags]
      }
      if (Object.porototype.toString.call(tags) === "[object String]") {
        blogData['tags'] = [tags]
      }
    }
    if (subcategory) {
      if (Array.isArray(subcategory)) {
        blogData['tags'] = [...subcategory]
      }
      if (Object.porototype.toString.call(subcategory) === "[object String]") {
        blogData['subcategory'] = [subcategory]
      }
    }

    const savedData = await blogModel.create(blogData);
    res.status(201).send({ status: true, msg: savedData });

  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
module.exports.createBlog = createBlog;

//--------------------------------------------------------------------//
//get Blog
//By author Id
// By category
// List of blogs that have a specific tag
// List of blogs that have a specific subcategory example of a query url: blogs?filtername=filtervalue&f2=fv2
const getBlog = async function (req, res) {
  try {
    const filterQuery = { isDeleted: false, deleteAt: null, isPublished: true }
    const queryParams = req.query
    if (isValidRequestBody(queryParams)) {

      const { authorId, category, tags, subcategory } = queryParams

      if (isValid(authorId) && isValidObjectId(authorId)) {
        filterQuery["authorId"] = authorId
      }
      if (isValid(category)) {
        filterQuery["category"] = category.trim()
      }
      if (isValid(tags)) {
        const tagsArr = tags.trim().split(",").map(tag => tag.trim())
        filterQuery["tags"] = { $all: tagsArr }
      }
      if (isValid(subcategory)) {
        const subArr = tags.trim().split(",").map(cat => cat.trim())
        filterQuery["subcategory"] = { $all: subArr }
      }

    }

    const blogs = await blogModel.find(filterQuery)
    if (Array.isArray(blogs) && blogs.length === 0) {
      res.status(404).send({
        status: false, message: "No blogs found"
      })
      return
    }
    I
    res.status(200).send({ status: true, message: blogs })


  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

module.exports.getBlog = getBlog;

//---------------------------------------------------------------------------------------------//
//updated blog
const updatedBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId;
   const requestBody = req.body
    const autherIdFromToken = req.authorId

    if (!isValidRequestBody(requestBody)) {
      res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide author detalls' })
      return
    }


    if (!isValidObjectId(blogId)) {
      return res
        .status(400)
        .send({ status: false, msg: ` ${blogId} not a valid ` });
    }
    if (!isValidObjectId(autherIdFromToken)) {
      return res
        .status(400)
        .send({ status: false, msg: `${autherIdFromToken} not a valid ` });
    }


    

const{title,body,tags,category,subcategory,isPublished} = requestBody

const updateBlog= {}

if(isValid(title)){
  if(Object.prototype.hasOwnProperty.call(updateBlog,'$set')) updateBlog['$set'] = {}
  updateBlog['$set']['title'] = title
}
if(isValid(body)){
  if(Object.prototype.hasOwnProperty.call(updateBlog,'$set')) updateBlog['$set'] = {}
  updateBlog['$set']['body'] = body
}
if(isValid(category)){
  if(Object.prototype.hasOwnProperty.call(updateBlog,'$set')) updateBlog['$set'] = {}
  updateBlog['$set']['category'] = category
}

if(isPublished != undefined){
  if(Object.prototype.hasOwnProperty.call(updateBlog,'$set')) updateBlog['$set'] = {}
  updateBlog['$set']['isPublished'] = isPublished
  updateBlog['$set']['ublishedAt'] = isPublished ? new Date():null
}

if(tags){
  if(Object.prototype.hasOwnProperty.call(updateBlog,'$addToSet')) updateBlog['$addToSet'] = {}
  if(Array.isArray(tags)){
    updateBlog['$addToSet']['tags'] = {$each:[...tags]}
  }
  if(typeof tags ==='string') {
    updateBlog['$addToSet']['tags'] = tags
  }
}
if(subcategory){
  if(Object.prototype.hasOwnProperty.call(updateBlog,'$addToSet')) updateBlog['$addToSet'] = {}
  if(Array.isArray(subcategory)){
    updateBlog['$addToSet']['subcategory'] = {$each:[...subcategory]}
  }
  if(typeof subcategory ==='string') {
    updateBlog['$addToSet']['subcategory'] = subcategory
  }
}




    if (blog.authorId.valueOf() == autherIdFromToken) {
      let updatedContent = await blogModel.findOneAndUpdate(
        {
          _id: blogId,
        },
        updateBlog,
        {
          new: true,
        }
      );
    
      return res.status(200).send({
        status: true,
        msg: updatedContent,
      });
    } else {
      res.status(400).send({
        status: false,
        message: "invalid user",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
module.exports.updatedBlog = updatedBlog;

//---------------------------------------------------------------------------//
//delete blog element
//Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
//If the blog document doesn't exist then return an HTTP status of 404 with a body like this

const deletedBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let autherIdFromToken = req.authorId

    if (!isValidObjectId(blogId)) {
      return res
        .status(400)
        .send({ status: false, msg: "  blogid is invalid" });
    }
    if (!isValidObjectId(autherIdFromToken)) {
      return res
        .status(400)
        .send({ status: false, msg: " invalid token id" });
    }
    let data = await blogModel.findOne({ _id: blogId, isDeleted: false, deleteAt: null })

    if (!data) {
      res.status(404).send({
        status: false,
        msg: "document does not exist",
      });
    }


    if (data.authorId.valueOf() == autherIdFromToken) {
      if (data.isDeleted == false) {
        let deleted = await blogModel.findOneAndUpdate(
          {
            _id: blogId,
          },
          {
            $set: {
              isDeleted: true,
              deleteAt: Date()
            },
          },
          {
            new: true,
          }
        );
        return res.status(200).send({
          status: true,
          msg: "blog deleted ",

        });
      }
    } else {
      res.status(403).send({
        status: false,
        msg: "you are not a valid author",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
module.exports.deletedBlog = deletedBlog;

//------------------------------------------------------------------------------------------------------------------------//
//delete block by params
// DELETE /blogs?queryParams
// Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// If the blog document doesn't exist then return an HTTP status of 404 with a body like this
const deletedBlogByParams = async (req, res) => {
  try {

    const filterQuery = { isDeleted: false, deleteAt: null }
    const queryParams = req.query
    const autherIdFromToken = req.authorId

    if (!isValidRequestBody(queryParams)) {

      return res
        .status(400)
        .send({ status: false, msg: "enter input " });
    }



    if (!isValidObjectId(autherIdFromToken)) {
      return res
        .status(400)
        .send({ status: false, msg: " invalid token id" });
    }

    const { authorId, category, tags, subcategory, isPublished } = queryParams

    if (isValid(authorId) && isValidObjectId(authorId)) {
      filterQuery["authorId"] = authorId
    }

    if (isValid(category)) {
      filterQuery["category"] = category.trim()
    }

    if (isValid(tags)) {
      const tagsArr = tags.trim().split(",").map(tag => tag.trim())
      filterQuery["tags"] = { $all: tagsArr }
    }

    if (isValid(subcategory)) {
      const subArr = tags.trim().split(",").map(cat => cat.trim())
      filterQuery["subcategory"] = { $all: subArr }
    }
    if (isValid(isPublished)) {
      filterQuery["isPublished"] = isPublished
    }


    const findBlogs = await blogModel.find(filterQuery)
    if (Array.isArray(findBlogs) && findBlogs.length === 0) {
      res.status(404).send({
        status: false, message: "No blogs found"
      })
      return
    }

    const ids = findBlogs.map(blog => {
      if (findBlogs.authorId.valueOf() == autherIdFromToken) return blog.id


    })


    if (ids.length === 0) {
      res.status(404).send({ status: false, message: "no blogs found" })
    }


    await blogModel.updateMany(
      {
        _id: { $in: ids }
      },
      {
        $set: {
          isDeleted: true,
          deleteAt: new Date(),
        }
      }
    );

    return res.status(200).send({
      status: true,
      message: "Blog deleted successfully",
    });

  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
module.exports.deletedBlogByParams = deletedBlogByParams;
