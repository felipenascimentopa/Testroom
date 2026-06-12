package br.cefetmg.testroom.service;

import br.cefetmg.testroom.model.Turma;
import br.cefetmg.testroom.repository.TurmaRepository;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;

@Service
public class TurmaService {
    private final TurmaRepository turmaRepository;
    private static final String CODIGO_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    private static final int CODIGO_LENGTH = 8;
    private final SecureRandom random = new SecureRandom();

    public TurmaService(TurmaRepository turmaRepository) {
        this.turmaRepository = turmaRepository;
    }

    public Turma criarTurma(Turma turma) {
        if (turma.getCodigoAcesso() == null || turma.getCodigoAcesso().isEmpty()) {
            turma.setCodigoAcesso(gerarCodigoUnico());
        }
        return turmaRepository.save(turma);
    }

    private String gerarCodigoUnico() {
        String codigo;
        do {
            StringBuilder sb = new StringBuilder(CODIGO_LENGTH);
            for (int i = 0; i < CODIGO_LENGTH; i++) {
                sb.append(CODIGO_CHARACTERS.charAt(random.nextInt(CODIGO_CHARACTERS.length())));
            }
            codigo = sb.toString();
        } while (turmaRepository.findByCodigoAcesso(codigo).isPresent());
        return codigo;
    }
}