const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (req, h) => {
  const { title, body, tags } = req.payload;
  const id = nanoid(16);

  const newNotes = {
    id,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags,
    body,
  };

  notes.push(newNotes);

  const isSuccess = notes.filter((note) => id === note.id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan!',
      data: {
        noteId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan!',
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: { notes },
});

const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const note = notes.find((note) => note.id === id);

  if (!note) {
    const response = h.response({
      status: 'fail',
      message: 'Catatan tidak ditemukan!',
    });
    response.code(404);
    return response;
  }
  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil ditemukan!',
    data: { note },
  });
  response.code(200);
  return response;
};

const updateNoteHandler = (req, h) => {
  const { id } = req.params;
  const { title, tags, body } = req.payload;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      body,
      tags,
      updatedAt: new Date().toISOString(),
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil di edit!',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal di edit!',
  });
  response.code(500);
  return response;
};

const deleteNoteHandler = (req, h) => {
  const { id } = req.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus!',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus!',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  updateNoteHandler,
  deleteNoteHandler,
};
