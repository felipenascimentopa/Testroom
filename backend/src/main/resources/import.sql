INSERT INTO usuario (id, email, senha, cargo) 
VALUES (1, 'professor@gmail.com', '123456', 'PROFESSOR');

INSERT INTO professor (id, nome, especialidade, descricao, usuario_id) 
VALUES (1, 'Professor Teste', 'Matemática', 'Professor de matemática e física', 1);