//
//  RunLoopDelegate.h
//  hybridge
//
//  Created by The Narrator on 10/27/12.
//
//

#ifndef __RUNLOOPDELEGATE_H__
#define __RUNLOOPDELEGATE_H__

#include "bridge/HGEPlatformRunLoop.h"

class RunLoopDelegate : public hybridge::HGEPlatformRunLoop {
public:
	RunLoopDelegate(pp::Instance* instance);
	~RunLoopDelegate();
	
	virtual hybridge::HGEAPI * attach(void * client);
	
	virtual void begin();
	
	virtual void update();
	
	virtual void present();
};

#endif
