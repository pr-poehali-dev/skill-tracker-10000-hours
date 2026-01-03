import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

type SkillLevel = {
  name: string;
  hours: number;
  color: string;
};

const SKILL_LEVELS: SkillLevel[] = [
  { name: 'Любитель', hours: 1000, color: 'bg-blue-500' },
  { name: 'Мастер', hours: 3000, color: 'bg-purple-500' },
  { name: 'Профи', hours: 5000, color: 'bg-orange-500' },
  { name: 'Легенда', hours: 10000, color: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
];

type Skill = {
  id: string;
  name: string;
  hours: number;
  icon: string;
  timerRunning?: boolean;
  timerStart?: number;
};

const Index = () => {
  const [isDark, setIsDark] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'Программирование', hours: 2450, icon: 'Code2' },
    { id: '2', name: 'Дизайн', hours: 780, icon: 'Palette' },
    { id: '3', name: 'Английский язык', hours: 4200, icon: 'Languages' },
  ]);

  const [newSkillName, setNewSkillName] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [hoursToAdd, setHoursToAdd] = useState('');
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isAddHoursOpen, setIsAddHoursOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getSkillLevel = (hours: number) => {
    for (let i = SKILL_LEVELS.length - 1; i >= 0; i--) {
      if (hours >= SKILL_LEVELS[i].hours) {
        return SKILL_LEVELS[i];
      }
    }
    return { name: 'Новичок', hours: 0, color: 'bg-gray-400' };
  };

  const getNextLevel = (hours: number) => {
    for (const level of SKILL_LEVELS) {
      if (hours < level.hours) {
        return level;
      }
    }
    return null;
  };

  const calculateProgress = (hours: number) => {
    return Math.min((hours / 10000) * 100, 100);
  };

  const addSkill = () => {
    if (newSkillName.trim()) {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: newSkillName,
        hours: 0,
        icon: 'Target',
      };
      setSkills([...skills, newSkill]);
      setNewSkillName('');
      setIsAddSkillOpen(false);
    }
  };

  const toggleTimer = (skillId: string) => {
    setSkills(skills.map(skill => {
      if (skill.id === skillId) {
        if (skill.timerRunning) {
          const elapsed = (Date.now() - (skill.timerStart || Date.now())) / 1000 / 3600;
          return {
            ...skill,
            timerRunning: false,
            timerStart: undefined,
            hours: skill.hours + elapsed
          };
        } else {
          return {
            ...skill,
            timerRunning: true,
            timerStart: Date.now()
          };
        }
      }
      return skill;
    }));
  };

  const getTimerDisplay = (skill: Skill) => {
    if (!skill.timerRunning || !skill.timerStart) return '00:00:00';
    const elapsed = Math.floor((currentTime - skill.timerStart) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const addHours = () => {
    const hours = parseFloat(hoursToAdd);
    if (selectedSkillId && hours > 0) {
      setSkills(skills.map(skill =>
        skill.id === selectedSkillId
          ? { ...skill, hours: skill.hours + hours }
          : skill
      ));
      setHoursToAdd('');
      setSelectedSkillId(null);
      setIsAddHoursOpen(false);
    }
  };

  const totalHours = skills.reduce((sum, skill) => sum + skill.hours, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-4 mb-4">
            <h1 className="text-5xl font-bold text-foreground tracking-tight">
              10,000 часов
            </h1>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="rounded-full"
            >
              <Icon name={isDark ? 'Sun' : 'Moon'} size={20} />
            </Button>
          </div>
          <p className="text-muted-foreground text-lg">
            Путь к мастерству через систематическую практику
          </p>
        </div>

        <Card className="backdrop-blur shadow-lg animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Icon name="TrendingUp" size={28} className="text-primary" />
              Общая статистика
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20">
                <div className="text-4xl font-bold text-primary">{totalHours}</div>
                <div className="text-sm text-muted-foreground mt-1">Всего часов</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl border border-purple-500/20">
                <div className="text-4xl font-bold text-purple-400">{skills.length}</div>
                <div className="text-sm text-muted-foreground mt-1">Навыков в работе</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-xl border border-orange-500/20">
                <div className="text-4xl font-bold text-orange-400">
                  {skills.filter(s => s.hours >= 10000).length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Достигли легенды</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-foreground">Мои навыки</h2>
          <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Icon name="Plus" size={18} />
                Добавить навык
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новый навык</DialogTitle>
                <DialogDescription>
                  Добавьте навык, который хотите развивать
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="skill-name">Название навыка</Label>
                  <Input
                    id="skill-name"
                    placeholder="Например: Игра на гитаре"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addSkill}>Добавить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => {
            const currentLevel = getSkillLevel(skill.hours);
            const nextLevel = getNextLevel(skill.hours);
            const progress = calculateProgress(skill.hours);

            return (
              <Card
                key={skill.id}
                className="bg-white/90 backdrop-blur shadow-lg border-0 hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Icon name={skill.icon} size={24} className="text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{skill.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {skill.hours.toLocaleString()} / 10,000 часов
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <Badge variant="secondary" className={`${currentLevel.color} text-white border-0`}>
                        {currentLevel.name}
                      </Badge>
                      <span className="text-muted-foreground font-medium">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    {nextLevel && (
                      <p className="text-xs text-muted-foreground">
                        До уровня "{nextLevel.name}": {(nextLevel.hours - skill.hours).toLocaleString()} ч
                      </p>
                    )}
                  </div>

                  {skill.timerRunning && (
                    <div className="text-center py-3 px-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                      <div className="text-2xl font-mono font-bold text-primary">
                        {getTimerDisplay(skill)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Таймер активен</div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={skill.timerRunning ? "destructive" : "default"}
                      className="gap-2"
                      onClick={() => toggleTimer(skill.id)}
                    >
                      <Icon name={skill.timerRunning ? "Square" : "Play"} size={18} />
                      {skill.timerRunning ? 'Стоп' : 'Старт'}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 hover:bg-primary hover:text-white transition-colors"
                      onClick={() => {
                        setSelectedSkillId(skill.id);
                        setIsAddHoursOpen(true);
                      }}
                    >
                      <Icon name="Clock" size={18} />
                      Добавить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Dialog open={isAddHoursOpen} onOpenChange={setIsAddHoursOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить время</DialogTitle>
              <DialogDescription>
                Сколько часов вы практиковались?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="hours">Количество часов</Label>
                <Input
                  id="hours"
                  type="number"
                  placeholder="0.5"
                  step="0.5"
                  value={hoursToAdd}
                  onChange={(e) => setHoursToAdd(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addHours()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addHours}>Добавить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;