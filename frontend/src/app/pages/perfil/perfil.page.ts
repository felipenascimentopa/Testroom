import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons,
  IonIcon, IonLabel, IonItem, IonAvatar, IonInput, IonModal,
  IonText, IonSpinner, IonNote
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/autenticacao.service';
import { ProfessorService } from '../../services/professor.service';
import { AlertController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBack, copyOutline, personOutline, mailOutline, idCardOutline,
  checkmarkCircle, checkmarkCircleOutline, createOutline, closeOutline,
  cameraOutline, schoolOutline, documentTextOutline, informationCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons,
    IonIcon, IonLabel, IonItem, IonAvatar, IonInput, IonModal,
    IonText, IonSpinner, IonNote
  ]
})
export class PerfilPage implements OnInit {
  professor: any = { nome: '', email: '', id: null, foto: '' };
  editando = false;
  nomeEdit = '';
  fotoTemporaria = '';
  carregando = false;
  outroProfessorId: number | null = null;
  modoProprio = true;

  constructor(
    private authService: AuthService,
    private professorService: ProfessorService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private route: ActivatedRoute,

  ) {
    addIcons({
      arrowBack, copyOutline, personOutline, mailOutline, idCardOutline,
      checkmarkCircle, createOutline, closeOutline, cameraOutline, checkmarkCircleOutline,
      schoolOutline, documentTextOutline, informationCircleOutline
    });
  }

  ngOnInit() {
    this.carregarPerfil();
    this.route.queryParams.subscribe(params => {
      const idParam = params['id'] ? +params['id'] : null;
      const meuId = this.authService.getProfessorId();
      this.outroProfessorId = idParam;
      this.modoProprio = !idParam || idParam === meuId;

      if (this.modoProprio) this.carregarPerfil();
      else this.carregarOutroPerfil(idParam!);
    });
  }

  carregarPerfil() {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.professor.nome = usuario.professorNome || 'Professor';
      this.professor.email = usuario.email;
      this.professor.id = usuario.professorId;
      this.professor.foto = usuario.foto || '';
      this.nomeEdit = this.professor.nome;
    }

    this.professorService.obterPerfil().subscribe({
      next: (data) => {
        this.professor = data;
        this.nomeEdit = data.nome;
        const usuario = this.authService.getUsuario();
        if (usuario) {
          usuario.professorNome = data.nome;
          usuario.foto = data.foto;
          this.authService.salvarUsuario(usuario);
        }
      },
      error: (err) => {
        console.warn('Erro ao buscar perfil do backend, usando dados locais', err);
      }
    });
  }

  carregarOutroPerfil(id: number) {
    this.carregando = true;
    this.professorService.buscarPorId(id).subscribe({
      next: (data) => {
        this.professor = data;
        this.carregando = false;
      },
      error: async () => {
        this.carregando = false;
        const t = await this.toastController.create({
          message: 'Professor não encontrado.', duration: 2000, color: 'danger'
        });
        await t.present();
        this.router.navigate(['/categorias']);
      }
    });
  }

  async salvarNome() {
    if (!this.nomeEdit.trim()) {
      const toast = await this.toastController.create({
        message: 'Nome não pode ficar vazio',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }
    this.carregando = true;
    this.professorService.atualizarNome(this.professor.id, this.nomeEdit).subscribe({
      next: async (res) => {
        this.professor.nome = res.nome;
        const usuario = this.authService.getUsuario();
        if (usuario) {
          usuario.professorNome = res.nome;
          this.authService.salvarUsuario(usuario);
        }
        this.editando = false;
        this.carregando = false;
        const toast = await this.toastController.create({
          message: 'Nome atualizado!',
          duration: 1500,
          color: 'success'
        });
        await toast.present();
      },
      error: async (err) => {
        this.carregando = false;
        const toast = await this.toastController.create({
          message: 'Erro ao atualizar nome',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  async escolherFoto() {
    const alert = await this.alertController.create({
      header: 'Escolher foto',
      inputs: [
        {
          name: 'url',
          type: 'text',
          placeholder: 'URL da imagem (ex: https://...)'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Definir',
          handler: (data) => {
            if (data.url && data.url.trim()) {
              this.definirFoto(data.url.trim());
            } else {
              return false;
            }
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async definirFoto(url: string) {
    this.carregando = true;
    this.professorService.atualizarFoto(this.professor.id, url).subscribe({
      next: async (res) => {
        this.professor.foto = res.foto;
        const usuario = this.authService.getUsuario();
        if (usuario) {
          usuario.foto = res.foto;
          this.authService.salvarUsuario(usuario);
        }
        this.carregando = false;
        const toast = await this.toastController.create({
          message: 'Foto atualizada!',
          duration: 1500,
          color: 'success'
        });
        await toast.present();
      },
      error: async (err) => {
        this.carregando = false;
        const toast = await this.toastController.create({
          message: 'Erro ao atualizar foto',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  getAvatarUrl() {
    if (this.professor.foto) return this.professor.foto;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.professor.nome)}&background=1a2f3a&color=fff&size=128`;
  }

  voltar() {
    if (!this.modoProprio) this.router.navigate(['/categorias']);
    else this.router.navigate(['/menu']);
  }

  async copiarId() {
    if (this.professor.id) {
      navigator.clipboard.writeText(this.professor.id.toString()).then(() => {
        this.mostrarToast('ID copiado!');
      }).catch(() => {
        this.mostrarToast('Não foi possível copiar.');
      });
    }
  }

  async mostrarToast(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }
}