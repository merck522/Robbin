import os
from bs4 import BeautifulSoup

def update_nav(html_file, role_template):
    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    nav_element = soup.find('nav', class_=lambda c: c and 'bottom-0' in c)
    if not nav_element:
        nav_element = soup.find(lambda tag: tag.name in ['nav', 'div'] and tag.get('class') and 'bottom-0' in tag.get('class'))

    if nav_element:
        template_soup = BeautifulSoup(role_template, 'html.parser')
        new_nav = template_soup.find('nav')
        current_filename = os.path.basename(os.path.dirname(html_file))
        
        for a_tag in new_nav.find_all('a'):
            href = a_tag.get('href', '')
            if current_filename in href:
                a_tag['class'] = "flex flex-col items-center gap-1 text-primary w-16"
                icon_span = a_tag.find('span', class_='material-symbols-outlined')
                if icon_span:
                    icon_span['style'] = "font-variation-settings: 'FILL' 1"
            else:
                a_tag['class'] = "flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors w-16"
                icon_span = a_tag.find('span', class_='material-symbols-outlined')
                if icon_span and icon_span.has_attr('style'):
                    del icon_span['style']
                
        nav_element.replace_with(new_nav)
        
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"Updated: {html_file}")
    else:
        print(f"No navigation bar found in {html_file}")

# --- Templates ---

# TRAINER navigation: Inicio, Clientes, Calendario, Paseo
trainer_template = """
<nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 px-6 py-3 pb-6 flex justify-between items-center z-50">
    <a href="../dashboard_del_entrenador_updated_style/code.html" class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors w-16">
        <span class="material-symbols-outlined text-[24px]">home</span>
        <span class="text-[9px] font-bold uppercase tracking-wider text-center line-clamp-1 truncate w-full">Inicio</span>
    </a>
    <a href="../lista_clientes/code.html" class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors w-16">
        <span class="material-symbols-outlined text-[24px]">group</span>
        <span class="text-[9px] font-bold uppercase tracking-wider text-center line-clamp-1 truncate w-full">Clientes</span>
    </a>
    <a href="../planificador_de_manadas/code.html" class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors w-16">
        <span class="material-symbols-outlined text-[24px]">calendar_today</span>
        <span class="text-[9px] font-bold uppercase tracking-wider text-center line-clamp-1 truncate w-full">Calendario</span>
    </a>
    <a href="../seguimiento_de_paseo_gps/code.html" class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors w-16">
        <span class="material-symbols-outlined text-[24px]">navigation</span>
        <span class="text-[9px] font-bold uppercase tracking-wider text-center line-clamp-1 truncate w-full">Paseo</span>
    </a>
</nav>
"""

# WALKER navigation: Inicio, Clientes, Explorar, Paseo
walker_template = """
<nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 px-6 py-3 pb-6 flex justify-between items-center z-50">
    <a href="../dashboard_del_paseador/code.html" class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors w-16">
        <span class="material-symbols-outlined text-[24px]">home</span>
        <span class="text-[9px] font-bold uppercase tracking-wider text-center line-clamp-1 truncate w-full">Inicio</span>
    </a>
    <a href="../lista_clientes/code.html" class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors w-16">
        <span class="material-symbols-outlined text-[24px]">group</span>
        <span class="text-[9px] font-bold uppercase tracking-wider text-center line-clamp-1 truncate w-full">Clientes</span>
    </a>
    <a href="../buscador_de_manadas/code.html" class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors w-16">
        <span class="material-symbols-outlined text-[24px]">search</span>
        <span class="text-[9px] font-bold uppercase tracking-wider text-center line-clamp-1 truncate w-full">Explorar</span>
    </a>
    <a href="../seguimiento_de_paseo_gps/code.html" class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors w-16">
        <span class="material-symbols-outlined text-[24px]">navigation</span>
        <span class="text-[9px] font-bold uppercase tracking-wider text-center line-clamp-1 truncate w-full">Paseo</span>
    </a>
</nav>
"""

# CLIENT Navigation (4 items)
client_template = """
<nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 px-6 py-3 pb-6 flex justify-between items-center z-50">
    <a href="../portal_del_due_o_updated_style/code.html" class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors w-16">
        <span class="material-symbols-outlined text-[24px]">home</span>
        <span class="text-[9px] font-bold uppercase tracking-wider text-center line-clamp-1 truncate w-full">Inicio</span>
    </a>
    <a href="../perfil_del_perro_updated_style/code.html" class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors w-16">
        <span class="material-symbols-outlined text-[24px]">pets</span>
        <span class="text-[9px] font-bold uppercase tracking-wider text-center line-clamp-1 truncate w-full">Mascotas</span>
    </a>
    <a href="../documentos_legales_updated_style/code.html" class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors w-16">
        <span class="material-symbols-outlined text-[24px]">description</span>
        <span class="text-[9px] font-bold uppercase tracking-wider text-center line-clamp-1 truncate w-full">Docs</span>
    </a>
    <a href="../registro_de_actividad_navy_theme/code.html" class="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors w-16">
        <span class="material-symbols-outlined text-[24px]">ecg_heart</span>
        <span class="text-[9px] font-bold uppercase tracking-wider text-center line-clamp-1 truncate w-full">Salud</span>
    </a>
</nav>
"""

# --- Mapping: Screen Directory -> Nav Template ---
mapping = {
    # Trainer Tier
    'dashboard_del_entrenador_updated_style': trainer_template,
    'inicio_entrenador': trainer_template,
    'crear_nuevo_contrato': trainer_template,
    'planificador_de_manadas': trainer_template,
    
    # Walker Tier
    'dashboard_del_paseador': walker_template,
    'contrato_paseo': walker_template,
    'buscador_de_manadas': walker_template,
    'seguimiento_de_paseo_gps': walker_template,

    # Shared screens (use trainer template for now as requested)
    'lista_clientes': trainer_template,
    
    # Client Tier
    'portal_del_due_o_updated_style': client_template,
    'perfil_del_perro_updated_style': client_template,
    'hoja_de_vida_canina': client_template,
    'documentos_legales_updated_style': client_template,
    'registro_de_actividad_navy_theme': client_template,
    'reporte_detallado_navy_theme': client_template,
    'actualizaciones_r_pidas_sem_foro': client_template,
}

if __name__ == "__main__":
    base_dir = "/Users/karen/Downloads/stitch"
    
    for dir_name, template in mapping.items():
        html_file = os.path.join(base_dir, dir_name, "code.html")
        if os.path.exists(html_file):
            try:
                update_nav(html_file, template)
            except Exception as e:
                print(f"Error updating {html_file}: {e}")
        else:
            print(f"Warning: File not found: {html_file}")
