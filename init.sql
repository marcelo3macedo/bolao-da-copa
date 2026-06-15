CREATE DATABASE IF NOT EXISTS bolao_copa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bolao_copa;

CREATE TABLE IF NOT EXISTS participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  token VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  home_team VARCHAR(100) NOT NULL,
  away_team VARCHAR(100) NOT NULL,
  home_flag VARCHAR(20) DEFAULT '',
  away_flag VARCHAR(20) DEFAULT '',
  game_date DATETIME NOT NULL COMMENT 'stored in UTC',
  stage VARCHAR(50) NOT NULL DEFAULT 'Fase de Grupos',
  group_name VARCHAR(5) DEFAULT NULL,
  home_score INT DEFAULT NULL,
  away_score INT DEFAULT NULL,
  is_finished TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  participant_id INT NOT NULL,
  game_id INT NOT NULL,
  home_score INT NOT NULL,
  away_score INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_bet (participant_id, game_id),
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- ============================================================
-- COPA DO MUNDO 2026 — FASE DE GRUPOS (datas em UTC)
-- Horário de Brasília = UTC - 3h
-- Fonte: calendário oficial FIFA / ESPN
-- ============================================================

INSERT INTO games (home_team, away_team, home_flag, away_flag, game_date, stage, group_name) VALUES

-- ========================
-- GRUPO A: México, África do Sul, Coreia do Sul, República Tcheca
-- ========================
-- MD1: Jun 11
('México',          'África do Sul',   '🇲🇽', '🇿🇦', '2026-06-11 19:00:00', 'Fase de Grupos', 'A'), -- 16h BRT
('Coreia do Sul',   'República Tcheca','🇰🇷', '🇨🇿', '2026-06-12 02:00:00', 'Fase de Grupos', 'A'), -- 23h BRT (11/jun)
-- MD2: Jun 18
('República Tcheca','África do Sul',   '🇨🇿', '🇿🇦', '2026-06-18 16:00:00', 'Fase de Grupos', 'A'), -- 13h BRT
('México',          'Coreia do Sul',   '🇲🇽', '🇰🇷', '2026-06-19 03:00:00', 'Fase de Grupos', 'A'), -- 00h BRT (19/jun)
-- MD3: Jun 24 — simultâneos
('República Tcheca','México',          '🇨🇿', '🇲🇽', '2026-06-25 01:00:00', 'Fase de Grupos', 'A'), -- 22h BRT (24/jun)
('África do Sul',   'Coreia do Sul',   '🇿🇦', '🇰🇷', '2026-06-25 01:00:00', 'Fase de Grupos', 'A'), -- 22h BRT (24/jun)

-- ========================
-- GRUPO B: Canadá, Bósnia e Herzegovina, Catar, Suíça
-- ========================
-- MD1: Jun 12-13
('Canadá',                 'Bósnia e Herzegovina', '🇨🇦', '🇧🇦', '2026-06-12 19:00:00', 'Fase de Grupos', 'B'), -- 16h BRT
('Catar',                  'Suíça',                '🇶🇦', '🇨🇭', '2026-06-13 19:00:00', 'Fase de Grupos', 'B'), -- 16h BRT
-- MD2: Jun 18
('Suíça',                  'Bósnia e Herzegovina', '🇨🇭', '🇧🇦', '2026-06-18 19:00:00', 'Fase de Grupos', 'B'), -- 16h BRT
('Canadá',                 'Catar',                '🇨🇦', '🇶🇦', '2026-06-18 22:00:00', 'Fase de Grupos', 'B'), -- 19h BRT
-- MD3: Jun 24 — simultâneos
('Suíça',                  'Canadá',               '🇨🇭', '🇨🇦', '2026-06-24 19:00:00', 'Fase de Grupos', 'B'), -- 16h BRT
('Bósnia e Herzegovina',   'Catar',                '🇧🇦', '🇶🇦', '2026-06-24 19:00:00', 'Fase de Grupos', 'B'), -- 16h BRT

-- ========================
-- GRUPO C: Brasil, Marrocos, Haiti, Escócia
-- ========================
-- MD1: Jun 13
('Brasil',  'Marrocos', '🇧🇷', '🇲🇦', '2026-06-13 22:00:00', 'Fase de Grupos', 'C'), -- 19h BRT
('Haiti',   'Escócia',  '🇭🇹', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '2026-06-14 01:00:00', 'Fase de Grupos', 'C'), -- 22h BRT (13/jun)
-- MD2: Jun 19
('Escócia', 'Marrocos', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🇲🇦', '2026-06-19 22:00:00', 'Fase de Grupos', 'C'), -- 19h BRT
('Brasil',  'Haiti',    '🇧🇷', '🇭🇹', '2026-06-20 01:00:00', 'Fase de Grupos', 'C'), -- 22h BRT (19/jun)
-- MD3: Jun 24 — simultâneos
('Escócia', 'Brasil',   '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🇧🇷', '2026-06-24 22:00:00', 'Fase de Grupos', 'C'), -- 19h BRT
('Marrocos','Haiti',    '🇲🇦', '🇭🇹', '2026-06-24 22:00:00', 'Fase de Grupos', 'C'), -- 19h BRT

-- ========================
-- GRUPO D: Estados Unidos, Paraguai, Austrália, Turquia
-- ========================
-- MD1: Jun 12-13
('Estados Unidos', 'Paraguai',  '🇺🇸', '🇵🇾', '2026-06-13 01:00:00', 'Fase de Grupos', 'D'), -- 22h BRT (12/jun)
('Austrália',      'Turquia',   '🇦🇺', '🇹🇷', '2026-06-14 04:00:00', 'Fase de Grupos', 'D'), -- 01h BRT (14/jun)
-- MD2: Jun 19-20
('Estados Unidos', 'Austrália', '🇺🇸', '🇦🇺', '2026-06-19 19:00:00', 'Fase de Grupos', 'D'), -- 16h BRT
('Turquia',        'Paraguai',  '🇹🇷', '🇵🇾', '2026-06-20 04:00:00', 'Fase de Grupos', 'D'), -- 01h BRT (20/jun)
-- MD3: Jun 25 — simultâneos
('Turquia',        'Estados Unidos', '🇹🇷', '🇺🇸', '2026-06-26 02:00:00', 'Fase de Grupos', 'D'), -- 23h BRT (25/jun)
('Paraguai',       'Austrália',      '🇵🇾', '🇦🇺', '2026-06-26 02:00:00', 'Fase de Grupos', 'D'), -- 23h BRT (25/jun)

-- ========================
-- GRUPO E: Alemanha, Curaçao, Costa do Marfim, Equador
-- ========================
-- MD1: Jun 14
('Alemanha',        'Curaçao',        '🇩🇪', '🇨🇼', '2026-06-14 17:00:00', 'Fase de Grupos', 'E'), -- 14h BRT
('Costa do Marfim', 'Equador',        '🇨🇮', '🇪🇨', '2026-06-14 23:00:00', 'Fase de Grupos', 'E'), -- 20h BRT
-- MD2: Jun 20
('Alemanha',        'Costa do Marfim','🇩🇪', '🇨🇮', '2026-06-20 20:00:00', 'Fase de Grupos', 'E'), -- 17h BRT
('Equador',         'Curaçao',        '🇪🇨', '🇨🇼', '2026-06-21 00:00:00', 'Fase de Grupos', 'E'), -- 21h BRT (20/jun)
-- MD3: Jun 25 — simultâneos
('Equador',         'Alemanha',       '🇪🇨', '🇩🇪', '2026-06-25 20:00:00', 'Fase de Grupos', 'E'), -- 17h BRT
('Curaçao',         'Costa do Marfim','🇨🇼', '🇨🇮', '2026-06-25 20:00:00', 'Fase de Grupos', 'E'), -- 17h BRT

-- ========================
-- GRUPO F: Holanda, Japão, Suécia, Tunísia
-- ========================
-- MD1: Jun 14
('Holanda', 'Japão',   '🇳🇱', '🇯🇵', '2026-06-14 20:00:00', 'Fase de Grupos', 'F'), -- 17h BRT
('Suécia',  'Tunísia', '🇸🇪', '🇹🇳', '2026-06-15 02:00:00', 'Fase de Grupos', 'F'), -- 23h BRT (14/jun)
-- MD2: Jun 20-21
('Holanda', 'Suécia',  '🇳🇱', '🇸🇪', '2026-06-20 17:00:00', 'Fase de Grupos', 'F'), -- 14h BRT
('Tunísia', 'Japão',   '🇹🇳', '🇯🇵', '2026-06-21 04:00:00', 'Fase de Grupos', 'F'), -- 01h BRT (21/jun)
-- MD3: Jun 25 — simultâneos
('Japão',   'Suécia',  '🇯🇵', '🇸🇪', '2026-06-25 23:00:00', 'Fase de Grupos', 'F'), -- 20h BRT
('Tunísia', 'Holanda', '🇹🇳', '🇳🇱', '2026-06-25 23:00:00', 'Fase de Grupos', 'F'), -- 20h BRT

-- ========================
-- GRUPO G: Bélgica, Egito, Irã, Nova Zelândia
-- ========================
-- MD1: Jun 15-16
('Bélgica',      'Egito',        '🇧🇪', '🇪🇬', '2026-06-15 22:00:00', 'Fase de Grupos', 'G'), -- 19h BRT
('Irã',          'Nova Zelândia','🇮🇷', '🇳🇿', '2026-06-16 04:00:00', 'Fase de Grupos', 'G'), -- 01h BRT (16/jun)
-- MD2: Jun 21-22
('Bélgica',      'Irã',          '🇧🇪', '🇮🇷', '2026-06-21 19:00:00', 'Fase de Grupos', 'G'), -- 16h BRT
('Nova Zelândia','Egito',        '🇳🇿', '🇪🇬', '2026-06-22 01:00:00', 'Fase de Grupos', 'G'), -- 22h BRT (21/jun)
-- MD3: Jun 26-27 — simultâneos
('Egito',        'Irã',          '🇪🇬', '🇮🇷', '2026-06-27 03:00:00', 'Fase de Grupos', 'G'), -- 00h BRT (27/jun)
('Nova Zelândia','Bélgica',      '🇳🇿', '🇧🇪', '2026-06-27 03:00:00', 'Fase de Grupos', 'G'), -- 00h BRT (27/jun)

-- ========================
-- GRUPO H: Espanha, Cabo Verde, Arábia Saudita, Uruguai
-- ========================
-- MD1: Jun 15
('Espanha',       'Cabo Verde',    '🇪🇸', '🇨🇻', '2026-06-15 17:00:00', 'Fase de Grupos', 'H'), -- 14h BRT
('Arábia Saudita','Uruguai',       '🇸🇦', '🇺🇾', '2026-06-15 22:00:00', 'Fase de Grupos', 'H'), -- 19h BRT
-- MD2: Jun 21
('Espanha',       'Arábia Saudita','🇪🇸', '🇸🇦', '2026-06-21 16:00:00', 'Fase de Grupos', 'H'), -- 13h BRT
('Uruguai',       'Cabo Verde',    '🇺🇾', '🇨🇻', '2026-06-21 22:00:00', 'Fase de Grupos', 'H'), -- 19h BRT
-- MD3: Jun 26-27 — simultâneos
('Cabo Verde',    'Arábia Saudita','🇨🇻', '🇸🇦', '2026-06-27 00:00:00', 'Fase de Grupos', 'H'), -- 21h BRT (26/jun)
('Uruguai',       'Espanha',       '🇺🇾', '🇪🇸', '2026-06-27 00:00:00', 'Fase de Grupos', 'H'), -- 21h BRT (26/jun)

-- ========================
-- GRUPO I: França, Senegal, Iraque, Noruega
-- ========================
-- MD1: Jun 16
('França',  'Senegal', '🇫🇷', '🇸🇳', '2026-06-16 19:00:00', 'Fase de Grupos', 'I'), -- 16h BRT
('Iraque',  'Noruega', '🇮🇶', '🇳🇴', '2026-06-16 22:00:00', 'Fase de Grupos', 'I'), -- 19h BRT
-- MD2: Jun 22-23
('França',  'Iraque',  '🇫🇷', '🇮🇶', '2026-06-22 21:00:00', 'Fase de Grupos', 'I'), -- 18h BRT
('Noruega', 'Senegal', '🇳🇴', '🇸🇳', '2026-06-23 00:00:00', 'Fase de Grupos', 'I'), -- 21h BRT (22/jun)
-- MD3: Jun 26 — simultâneos
('Noruega', 'França',  '🇳🇴', '🇫🇷', '2026-06-26 19:00:00', 'Fase de Grupos', 'I'), -- 16h BRT
('Senegal', 'Iraque',  '🇸🇳', '🇮🇶', '2026-06-26 19:00:00', 'Fase de Grupos', 'I'), -- 16h BRT

-- ========================
-- GRUPO J: Argentina, Argélia, Áustria, Jordânia
-- ========================
-- MD1: Jun 16-17
('Argentina', 'Argélia',  '🇦🇷', '🇩🇿', '2026-06-17 01:00:00', 'Fase de Grupos', 'J'), -- 22h BRT (16/jun)
('Áustria',   'Jordânia', '🇦🇹', '🇯🇴', '2026-06-17 04:00:00', 'Fase de Grupos', 'J'), -- 01h BRT (17/jun)
-- MD2: Jun 22-23
('Argentina', 'Áustria',  '🇦🇷', '🇦🇹', '2026-06-22 17:00:00', 'Fase de Grupos', 'J'), -- 14h BRT
('Jordânia',  'Argélia',  '🇯🇴', '🇩🇿', '2026-06-23 03:00:00', 'Fase de Grupos', 'J'), -- 00h BRT (23/jun)
-- MD3: Jun 27-28 — simultâneos
('Argélia',   'Áustria',  '🇩🇿', '🇦🇹', '2026-06-28 02:00:00', 'Fase de Grupos', 'J'), -- 23h BRT (27/jun)
('Jordânia',  'Argentina','🇯🇴', '🇦🇷', '2026-06-28 02:00:00', 'Fase de Grupos', 'J'), -- 23h BRT (27/jun)

-- ========================
-- GRUPO K: Portugal, Congo (RD), Uzbequistão, Colômbia
-- ========================
-- MD1: Jun 17-18
('Portugal',    'Congo (RD)',    '🇵🇹', '🇨🇩', '2026-06-17 17:00:00', 'Fase de Grupos', 'K'), -- 14h BRT
('Uzbequistão', 'Colômbia',     '🇺🇿', '🇨🇴', '2026-06-18 02:00:00', 'Fase de Grupos', 'K'), -- 23h BRT (17/jun)
-- MD2: Jun 23-24
('Portugal',    'Uzbequistão',  '🇵🇹', '🇺🇿', '2026-06-23 17:00:00', 'Fase de Grupos', 'K'), -- 14h BRT
('Colômbia',    'Congo (RD)',   '🇨🇴', '🇨🇩', '2026-06-24 02:00:00', 'Fase de Grupos', 'K'), -- 23h BRT (23/jun)
-- MD3: Jun 27 — simultâneos
('Colômbia',    'Portugal',     '🇨🇴', '🇵🇹', '2026-06-27 23:30:00', 'Fase de Grupos', 'K'), -- 20h30 BRT
('Congo (RD)',  'Uzbequistão',  '🇨🇩', '🇺🇿', '2026-06-27 23:30:00', 'Fase de Grupos', 'K'), -- 20h30 BRT

-- ========================
-- GRUPO L: Inglaterra, Croácia, Gana, Panamá
-- ========================
-- MD1: Jun 17
('Inglaterra', 'Croácia', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇭🇷', '2026-06-17 20:00:00', 'Fase de Grupos', 'L'), -- 17h BRT
('Gana',       'Panamá',  '🇬🇭', '🇵🇦', '2026-06-17 23:00:00', 'Fase de Grupos', 'L'), -- 20h BRT
-- MD2: Jun 23
('Inglaterra', 'Gana',    '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇬🇭', '2026-06-23 20:00:00', 'Fase de Grupos', 'L'), -- 17h BRT
('Panamá',     'Croácia', '🇵🇦', '🇭🇷', '2026-06-23 23:00:00', 'Fase de Grupos', 'L'), -- 20h BRT
-- MD3: Jun 27 — simultâneos
('Panamá',     'Inglaterra','🇵🇦', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2026-06-27 21:00:00', 'Fase de Grupos', 'L'), -- 18h BRT
('Croácia',    'Gana',    '🇭🇷', '🇬🇭', '2026-06-27 21:00:00', 'Fase de Grupos', 'L'); -- 18h BRT

-- Participantes de exemplo
INSERT INTO participants (name, token) VALUES
('Exemplo - João', 'joao123'),
('Exemplo - Maria', 'maria456');
