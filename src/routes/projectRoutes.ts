import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";
import { hasAuthorization, taskBelongToProject, validateTaskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router()

router.use(authenticate)

/**Crear Proyecto */
router.post('/',
    body('projectName')
        .notEmpty().withMessage('El nombre del Proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion del Proyecto es Obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)

/**Obtener proyectos */
router.get('/', ProjectController.getAllProjects)

/**Obtener Proyecto */
router.get('/:id', 
    param('id')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.getProjectById
)

/**Routes for tasks */
router.param('projectId', validateProjectExists)

/**Actualizar Proyecto */
router.put('/:projectId',
    param('projectId')
        .isMongoId().withMessage('ID no valido'),
    body('projectName')
        .notEmpty().withMessage('El nombre del Proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion del Proyecto es Obligatoria'), 
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
)

/**Eliminar Proyecto */
router.delete('/:projectId', 
    param('projectId')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
)

/**Crear tarea */
router.post('/:projectId/task',
    hasAuthorization,
    body('name')
        .notEmpty().withMessage('El nombre de la Tarea es Obligatoria'),
    body('description')
        .notEmpty().withMessage('La descripcion de la Tarea es Obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

/**Obtener tareas de un proyecto */
router.get('/:projectId/task',
    TaskController.getProjectTasks
)

/**Validar si la tarea existe */
router.param('taskId', validateTaskExists)
/**Validar si la tarea pertenece al proyecto */
router.param('taskId', taskBelongToProject)

/**Obtener Tarea */
router.get('/:projectId/task/:taskId', 
    param('taskId')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.getTaskById
)

/**Actualizar tarea */
router.put('/:projectId/task/:taskId', 
    hasAuthorization,
    param('taskId')
        .isMongoId().withMessage('ID no valido'),
    body('name')
        .notEmpty().withMessage('El nombre de la Tarea es Obligatoria'),
    body('description')
        .notEmpty().withMessage('La descripcion de la Tarea es Obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

/**Eliminar tarea */
router.delete('/:projectId/task/:taskId', 
    hasAuthorization,
    param('taskId')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.deleteTask
)

/**Cambiar estado de la tarea */
router.post('/:projectId/task/:taskId/status',
    param('taskId')
        .isMongoId().withMessage('ID no valido'),
    body('status')
        .notEmpty().withMessage('El estado es Obligatorio'),
    handleInputErrors,
    TaskController.updateStatusTask
)

/**Routes for teams */
router.post('/:projectId/team/find',
    body('email')
        .isEmail().withMessage('Email no Valido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team', TeamMemberController.getProjectTeam)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamMemberController.addMemeberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamMemberController.removeMemeberById
)

/**Routes or Notes */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage("El contenido de la nota es obligatorio"),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router