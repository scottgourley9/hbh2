const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const config = require('./config');

const expensesApi = require('./api/expenses');
const materialsApi = require('./api/materials');
const milestonesApi = require('./api/milestones');
const moodboardImagesApi = require('./api/moodboardImages');
const projectPhotosApi = require('./api/projectPhotos');
const projectsApi = require('./api/projects');
const resourcesApi = require('./api/resources');
const taskItemsApi = require('./api/taskItems');
const taskPhotosApi = require('./api/taskPhotos');
const taskSectionsApi = require('./api/taskSections');
const usersApi = require('./api/users');

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json({ limit: '20mb' }));

app.get('/health', (req, res) => {
    res.status(200).json('Healthy');
});

app.post('/expenses/create', expensesApi?.create);
app.get('/expenses/read/:id', expensesApi?.read);
app.get('/expenses/readAll/:id', expensesApi?.readAll);
app.put('/expenses/update/:id', expensesApi?.update);
app.delete('/expenses/delete/:id', expensesApi?.delete);

app.post('/materials/create', materialsApi?.create);
app.get('/materials/read/:id', materialsApi?.read);
app.get('/materials/readAll/:project_id', materialsApi?.readAll);
app.put('/materials/update/:id', materialsApi?.update);
app.delete('/materials/delete/:id', materialsApi?.delete);

app.post('/milestones/create', milestonesApi?.create);
app.get('/milestones/read/:id', milestonesApi?.read);
app.put('/milestones/update/:id', milestonesApi?.update);
app.delete('/milestones/delete/:id', milestonesApi?.delete);

app.post('/moodboardImages/create', moodboardImagesApi?.create);
app.get('/moodboardImages/read/:id', moodboardImagesApi?.read);
app.get('/moodboardImages/readAll/:project_id', moodboardImagesApi?.readAll);
app.put('/moodboardImages/update/:id', moodboardImagesApi?.update);
app.delete('/moodboardImages/delete/:id', moodboardImagesApi?.delete);

app.post('/projectPhotos/create', projectPhotosApi?.create);
app.get('/projectPhotos/read/:id', projectPhotosApi?.read);
app.put('/projectPhotos/update/:id', projectPhotosApi?.update);
app.delete('/projectPhotos/delete/:id', projectPhotosApi?.delete);

app.post('/projects/create', projectsApi?.create);
app.post('/projects/template/createCopy', projectsApi?.templateCreateCopy);
app.get('/projects/read/:id', projectsApi?.read);
app.get('/projects/readAll/:user_id', projectsApi?.readAll);
app.get('/projects/shareable/readAll', projectsApi?.readAllShareable);
app.put('/projects/update/:id', projectsApi?.update);
app.delete('/projects/delete/:id', projectsApi?.delete);

app.post('/resources/create', resourcesApi?.create);
app.get('/resources/readAll', resourcesApi?.readAll);
app.get('/resources/read/:id', resourcesApi?.read);
app.put('/resources/update/:id', resourcesApi?.update);
app.delete('/resources/delete/:id', resourcesApi?.delete);

app.post('/taskItems/create', taskItemsApi?.create);
app.get('/taskItems/read/:id', taskItemsApi?.read);
app.get('/taskItems/readAll/:project_id', taskItemsApi?.readAll);
app.put('/taskItems/update/:id', taskItemsApi?.update);
app.delete('/taskItems/delete/:id', taskItemsApi?.delete);
app.get('/taskItems/upcomingTasks/:user_id', taskItemsApi?.upcomingTasks);

app.post('/taskPhotos/create', taskPhotosApi?.create);
app.get('/taskPhotos/read/:id', taskPhotosApi?.read);
app.get('/taskPhotos/readAll/:task_id', taskPhotosApi?.readAll);
app.put('/taskPhotos/update/:id', taskPhotosApi?.update);
app.delete('/taskPhotos/delete/:id', taskPhotosApi?.delete);

app.post('/taskSections/create', taskSectionsApi?.create);
app.get('/taskSections/read/:id', taskSectionsApi?.read);
app.get('/taskSections/readAll/:project_id', taskSectionsApi?.readAll);
app.put('/taskSections/update/:id', taskSectionsApi?.update);
app.delete('/taskSections/delete/:id', taskSectionsApi?.delete);

app.post('/users/create', usersApi?.create);
app.post('/users/verifyToken', usersApi?.verifyToken);
app.post('/users/signIn', usersApi?.signIn);
app.get('/users/read/:id', usersApi?.read);
app.put('/users/update/:id', usersApi?.update);
app.delete('/users/delete/:id', usersApi?.delete);
app.put('/users/updatePinnedResources/:id', usersApi?.updatePinnedResources);
app.get('/users/pinnedResouces/:id', usersApi?.pinnedResouces);


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(config?.port, function(){
    console.log('listening on port ' + config?.port);
});
